import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { Link } from 'react-router-dom'

export default function FolderBreadCrumbs({ currentFolder }) {
    let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]
    if (currentFolder) path = [...path, ...currentFolder.path]
    return (
        <Breadcrumb className="flex-grow-1" listProps={{ className: 'bg-white pl-0 m-0' }}>
            {[...path].map((folder, index) => {
                return (<Breadcrumb.Item linkAs={Link} key={folder.id}
                    className="text-truncate d-inline-block"
                    style={{ maxWidth: '150px' }}
                    linkProps={{
                        to:
                        {
                            pathname: folder.id ? `/folder/${folder.id}` : '/',
                            state: { folder: { ...folder, path: path.slice(1, index) } }
                        }
                    }
                    }
                >{folder.name}</Breadcrumb.Item>)
            })}
            {currentFolder && (
                <Breadcrumb.Item className="text-truncate d-inline-block" active style={{ maxWidth: '200px' }}>
                    {currentFolder.name}
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}
