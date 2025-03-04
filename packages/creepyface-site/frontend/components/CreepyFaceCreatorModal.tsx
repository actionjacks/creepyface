import React from 'react'
import CreepyFace, { getHostedImages, Images } from './CreepyFace'
import CreepyFaceOptions from './CreepyFaceOptions'
import getNext, { getAngles } from '../get-next'
import tips from '../tips'
import { ImageIcon } from './Icon'
import Modal from './Modal'
import { useShortcuts } from './Shortcuts'
import Button from './Button'
import { useTranslate } from './Language'
import Upload from './Upload'
import Video from './Video'
import { restartCreation, takePicture, toggleShortcuts } from '../redux/actions'
import { useSelector, useDispatch } from './State'
import { Pictures } from '../redux/types'

const defaultCreepyFaceImages = getHostedImages()

const getSrc = (next: keyof Pictures, images: Images) => {
  const look = images.looks.find(({ angle }) => angle === next)
  return look ? look.src : next === 'serious' ? images.src : images.hover
}

function Take({ next }: { next: keyof Pictures }) {
  const dispatch = useDispatch()
  const translate = useTranslate()

  return (
    <>
      <header>
        <ImageIcon next={next} /> {translate('Look')}{' '}
        <strong>{translate(tips[next])}</strong> <ImageIcon next={next} />
      </header>
      <div className="pictures">
        <span className="creepy">
          <img
            className="example"
            alt={translate('Sample face')}
            src={getSrc(next, defaultCreepyFaceImages)}
          />
        </span>
        <Video
          onLoad={shoot => dispatch({ type: 'videoReady', payload: shoot })}
          onUnload={() => dispatch({ type: 'videoNotReady' })}
        />
      </div>
      <Button icon="camera" showShortcut action={takePicture}>
        {translate('Take picture')}
      </Button>
    </>
  )
}

function Download(props: { pictures: Pictures }) {
  const { pictures } = props
  const translate = useTranslate()
  return (
    <>
      <header>
        <strong>{translate('You are done!')}</strong>{' '}
        {translate('This is your creepyface')}:
      </header>
      <CreepyFace
        alt={translate('Your creepy face')}
        images={{
          src: pictures.serious.src,
          hover: pictures.hover.src,
          looks: getAngles().map(angle => ({ angle, src: pictures[angle].src }))
        }}
      />
      <Upload />
    </>
  )
}

export default function CreepyFaceCreatorModal(props: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const pictures = useSelector(state => state.pictures)
  const translate = useTranslate()
  const shortcuts = useShortcuts()
  const next = getNext(pictures)

  return (
    <Modal
      id="creator"
      isOpen={props.isOpen}
      title={translate('Creepyface creator')}
      onOpen={props.onOpen}
      onClose={props.onClose}
    >
      {next !== undefined ? (
        <Take next={next} />
      ) : (
        <Download pictures={pictures as Pictures} />
      )}
      <CreepyFaceOptions next={next} pictures={pictures} />
      <footer>
        <small>
          <Button icon="refresh" type="link" action={restartCreation}>
            {translate('Start over')}
          </Button>
          <Button
            className="shortcuts-toggle"
            icon="keyboard"
            type="link"
            action={toggleShortcuts}
          >
            {translate(shortcuts.show ? 'Hide' : 'Show')}{' '}
            {translate('keyboard shortcuts')}
          </Button>
        </small>
      </footer>
    </Modal>
  )
}
