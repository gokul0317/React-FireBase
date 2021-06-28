import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { Toast, ProgressBar } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import { storage, database } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { v4 as uuidv4 } from 'uuid'
export default function AddFileButton({ currentFolder }) {
    const { currentUser } = useAuth()
    const [uploadingFiles, setUploadingFiles] = useState([])
    const handleUpload = (e) => {
        const file = e.target.files[0]
        if (currentFolder === null || file === null) return
        const id = uuidv4()
        setUploadingFiles(prev => [...prev, { id, name: file.name, progress: 0, error: false }])
        const filePath = currentFolder === ROOT_FOLDER
            ? `${currentFolder.path.join('/')}/${file.name}`
            : `${currentFolder.path.join('/')}/${currentFolder.name}/${file.name}`

        const uploadTask =
            storage.ref(`/files/${currentUser.uid}/${filePath}`)
                .put(file)
        uploadTask.on('state_changed', snapshot => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes
            setUploadingFiles(prev => {
                return prev.map((prog) => {
                    if (prog.id === id) {
                        return { ...prog, progress }
                    }
                    return prog
                })
            })
        }, () => {
            setUploadingFiles(prev => {
                return prev.map((prog) => {
                    if (prog.id === id) {
                        return { ...prog, error: true }
                    }
                    return prog
                })
            })
        }, () => {
            setUploadingFiles(prev => {
                return prev.filter((prog) => prog.id !== id)
            })
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                database.files
                    .where("name", "==", file.name)
                    .where("userId", "==", currentUser.uid)
                    .where("folderId", "==", currentFolder.id)
                    .get()
                    .then(existingFiles => {
                        const existingFile = existingFiles.docs[0]
                        if (existingFile) {
                            existingFile.ref.update({ url: downloadURL })
                        } else {
                            database.files.add({
                                url: downloadURL,
                                name: file.name,
                                createdAt: database.getCurrentTimestamp(),
                                folderId: currentFolder.id,
                                userId: currentUser.uid,
                            })
                        }
                    })
            })
        })
    }
    return (
        <>
            <label className="btn btn-outline-success btn-sm m-0 mr-2">
                <FontAwesomeIcon icon={faFileUpload} />
                <input type="file" onChange={handleUpload} style={{ opacity: 0, position: 'absolute', left: '-99999px' }} />
            </label>
            {uploadingFiles.length > 0 && createPortal(
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', maxWidth: '250px' }}>
                    {uploadingFiles.map(file => (<Toast key={file.id} onClose={() => {
                        setUploadingFiles(prev => prev.filter(cFile => cFile.id !== file.id))
                    }}>
                        <Toast.Header closeButton={file.error} className="w-100 text-truncate d-block">{file.name}</Toast.Header>
                        <Toast.Body>
                            <ProgressBar animated={!file.error} now={file.error ? 100 : file.progress * 100} label={file.error ? 'Error' : `${Math.round(file.progress * 100)}%`} variant={file.error ? 'danger' : 'primary'} ></ProgressBar>
                        </Toast.Body>
                    </Toast>))}
                </div>
                , document.body)}
        </>
    )
}
