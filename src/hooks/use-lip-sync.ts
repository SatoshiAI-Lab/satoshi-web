import { Live2DModel } from '../components/live2d-model/types'

export interface UseLipSyncOptions {
  /**
   * Skip frequency collect radix,
   * after testing, 200 is a good value.
   **/
  skipFrequencyRadix?: number
  /**
   * Model render fps, 30 is sufficient.
   **/
  fps?: number
  /**
   * Model mouth open radix,
   * if female voice, may set this to 0, male set this to 0.3.
   */
  mouthRadix?: number
}

export interface UseLipSyncOverrideOptions {
  overrideModel?: Live2DModel
  weight?: number
  endMouthValue?: number
}

export interface UseLipSync {
  (model: Live2DModel, options?: UseLipSyncOptions): UseLipSyncReturn
}

export interface UseLipSyncReturn {
  (path: string, overrideOptions?: UseLipSyncOverrideOptions): () => void
}

/**
 * Live2D model lip sync hook.
 * @param model Live2D model.
 * @param options options, see `UseLipSyncOptions`.
 * @return Return a start function, start function return a stop function.
 */
export const useLipSync: UseLipSync = (model, options) => {
  let lastSource: AudioBufferSourceNode | undefined

  return (path, overrideOptions) => {
    const {
      skipFrequencyRadix = 200,
      fps = 30,
      mouthRadix = 0.3,
    } = options ?? {}
    const {
      overrideModel,
      weight = 1,
      endMouthValue = 0,
    } = overrideOptions ?? {}
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    let isSpeaking = true
    model = overrideModel ?? model

    // Set mouth open radix
    function setMouth(value: number) {
      model.internalModel.coreModel?.setParameterValueById(
        'ParamMouthOpenY',
        // Fixed between 0 ~ 1
        Math.max(0, Math.min(1, value)),
        weight
      )
    }

    // Get voice frequency data
    function getByteFrequencyData() {
      const frequencyData = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(frequencyData)
      return frequencyData
    }

    // Start lip sync
    function startLipSync() {
      const arrTotal = (arr: number[]) => arr.reduce((p, c) => p + c, 0)
      const handleLipSync = () => {
        // If not speaking, reset mouth to close state.
        if (!isSpeaking) {
          setMouth(endMouthValue)
          return
        }

        const frequencyData = getByteFrequencyData()
        const arr = []

        for (let i = 0; i < frequencyData.length; i += skipFrequencyRadix) {
          arr.push(frequencyData[i])
        }

        const mouthValue = (arrTotal(arr) / arr.length - 20) / 60

        setMouth(mouthValue + mouthRadix)
        setTimeout(handleLipSync, 1000 / fps)
      }
      handleLipSync()
    }

    // Stop lip sync
    function stop() {
      isSpeaking = false
      lastSource?.stop()
    }

    // Get voice file, and start lip sync
    function fetchAndStart(path: string) {
      // Get voice file to ArrayBuffer
      fetch(path).then(async (response) => {
        const audioData = await response.arrayBuffer()

        startLipSync()
        // decode and handling
        audioContext.decodeAudioData(audioData, (buffer) => {
          const source = audioContext.createBufferSource()
          isSpeaking = true
          lastSource?.stop()
          lastSource = source
          source.buffer = buffer
          source.connect(audioContext.destination)
          source.connect(analyser)
          source.start(0)
          source.onended = stop
        })
      })
    }

    fetchAndStart(path)

    return stop
  }
}
