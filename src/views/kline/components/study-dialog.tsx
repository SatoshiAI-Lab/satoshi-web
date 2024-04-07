import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  PaperProps,
} from '@mui/material'
import { MdOutlineSettings } from 'react-icons/md'
import Draggable from 'react-draggable'

import { useKLineStore } from '@/stores/use-kline-store'

import type { EntityId } from '../../../../public/tradingview/charting_library/charting_library'

interface StudyDialogProps {
  open: boolean
  title?: string
  content?: string
  studyName?: string
  ownerStudyId?: EntityId
  draggable?: boolean
  onClose?(): void
  getVisible?(): boolean
  setVisible?(visible: boolean): void
}

export const StudyDialog: React.FC<StudyDialogProps> = (props) => {
  const {
    open,
    title,
    content,
    studyName,
    ownerStudyId,
    draggable = true,
    onClose,
  } = props
  const { chart } = useKLineStore()
  const [showStudy, setShowStudy] = useState(false)

  const DraggableDialog = (props: PaperProps) => {
    return draggable ? (
      <Draggable handle="#dialog-title">
        <Paper {...props} />
      </Draggable>
    ) : (
      <Paper {...props} />
    )
  }

  const showStudyClick = () => {
    if (!ownerStudyId) return

    const activeChart = chart?.activeChart()
    if (!activeChart) return

    const study = activeChart.getStudyById(ownerStudyId)
    const visible = study.isVisible()

    setShowStudy(!visible)
    study.setVisible(!visible)
  }

  const onSettingClick = () => {}

  const onReadMoreClick = () => {}

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperComponent={DraggableDialog}>
        <DialogTitle
          id="dialog-title"
          className={`${draggable && '!cursor-move'}`}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <span className="mr-2">{content}</span>
          <Link
            component="button"
            underline="none"
            className="!align-bottom"
            onClick={onReadMoreClick}
          >
            Readmore
          </Link>
        </DialogContent>
        <DialogContent className="flex justify-between items-center">
          <Button variant="outlined" onClick={showStudyClick}>
            {showStudy ? 'Hide' : 'Show'} {studyName}
          </Button>
          <IconButton onClick={onSettingClick}>
            <MdOutlineSettings size={24} />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StudyDialog
