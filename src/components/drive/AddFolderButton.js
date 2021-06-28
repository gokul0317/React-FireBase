import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { database } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { ROOT_FOLDER } from '../../hooks/useFolder'

export default function AddFolderButton({ currentFolder }) {
    const { getCurrentTimestamp, folders } = database
    const { currentUser } = useAuth()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (currentFolder === null) return
        const path = [...currentFolder.path]
        if (currentFolder !== ROOT_FOLDER) {
            path.push({ id: currentFolder.id, name: currentFolder.name})
        }
        try {
            await folders.add({
                name,
                parentId: currentFolder.id,
                userId: currentUser.uid,
                path,
                createdAt: getCurrentTimestamp()
            })
        } catch(e) {
            console.log(e)
        }
        setName("")
        closeModal()
    }
    return (
        <>
            <Button onClick={openModal} variant="outline-success" size="sm">
                <FontAwesomeIcon icon={faFolderPlus} />
            </Button>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                        <Button type="submit" variant="success">Add Folder</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
