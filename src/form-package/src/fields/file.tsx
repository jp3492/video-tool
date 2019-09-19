import React, { useState, useRef, useMemo, useEffect } from 'react'

const Uppy = require('@uppy/core')
const AwsS3 = require('@uppy/aws-s3')
const { DragDrop } = require('@uppy/react')

let getAuthToken, s3Url

export const configureFileUpload = (props: {
  getAuthToken: Function,
  s3Url: string
}) => {
  getAuthToken = props.getAuthToken
  s3Url = props.s3Url
}

export const File = ({
  id,
  label,
  description,
  multiple,
  accept,
  value,
  disabled,
  onBlur,
  onChange,
  error,
  touched
}) => {
  const [status, setStatus] = useState("idle")
  const [links, setLinks] = useState<any[] | []>([])
  const linkRef = useRef<any[]>(links)

  useEffect(() => {
    if (links.length !== 0 && links.every(l => l.status !== "uploading")) {
      if (multiple) {
        // @ts-ignore
        onChange(id, [...value, ...links.map(l => l.link)])
      } else {
        onChange(id, links[0].link)
      }
      setLinks([])
      linkRef.current = []
    }
  }, [links])

  const config = {
    allowedFileTypes: accept
  }

  const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: !multiple ?
      {
        ...config,
        maxNumberOfFiles: 1
      } :
      config,
    allowMultipleUploads: multiple,
    autoProceed: true,

  })

  uppy.use(AwsS3, {
    getUploadParameters: (file) => {
      const token = getAuthToken()
      return fetch(s3Url, {
        method: 'post',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: token
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type
        })
      }).then((response) => {
        return response.json()
      }).then((data) => {
        return {
          method: data.method,
          url: data.url,
          fields: data.fields
        }
      })

    }
  })

  uppy.on('file-added', (file) => {
    const data = file.data
    const url = URL.createObjectURL(data)
    const image = new Image()
    image.src = url
    image.onload = () => {
      uppy.setFileMeta(file.id, { width: image.width, height: image.height })
      URL.revokeObjectURL(url)
    }
  })
  uppy.on('upload', (e) => {
    linkRef.current = e.fileIDs.map(f => ({ id: f, status: "uploading" }))
    setLinks(e.fileIDs.map(f => ({ id: f, status: "uploading" })))
    setStatus("loading")
  })
  uppy.on('upload-error', (file, err, res) => {
    linkRef.current = linkRef.current.map(l => l.id === file.id ? { ...l, status: 'failed' } : l)
    // @ts-ignore
    setLinks(links.map(l => l.id === file.id ? { ...l, status: 'failed' } : l))
    setStatus("fail")
  })

  uppy.on('upload-success', (file, data) => {
    // handleAddedFile({
    //   field: props,
    //   file: {
    //     format: file.meta.type,
    //     height: file.meta.height,
    //     width: file.meta.width,
    //     size: file.data.size
    //   }
    // })
    linkRef.current = linkRef.current.map(l => l.id === file.id ? { ...l, link: `${file.xhrUpload.endpoint}/${file.meta.key}`, status: 'uploaded' } : l)
    // @ts-ignore
    setLinks(linkRef.current.map(l => l.id === file.id ? { ...l, link: `${file.xhrUpload.endpoint}/${file.meta.key}`, status: 'uploaded' } : l))
    setStatus("success")
  })

  const removeFile = link => onChange(id, value.filter(v => v !== link))

  const adjustedLinks = useMemo(() => [
    ...value.map(v => ({ id: "", link: v, status: "" })),
    ...linkRef.current
  ], [value, linkRef.current])

  return (
    <div
      onBlur={() => onBlur(id)}
      className={`rf-file field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      {
        multiple ?
          <MultipleFiles
            links={adjustedLinks}
            uppy={uppy}
            disabled={disabled}
            removeFile={removeFile} /> :
          <SingleFile
            link={value}
            disabled={disabled}
            uppy={uppy}
            status={status} />
      }
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}

const SingleFile = ({
  link,
  disabled,
  uppy,
  status
}) => {
  return (
    <div>
      <button>Add File</button>
      <div className="pt-rf__file__uppy">
        <div
          style={{
            backgroundImage: `url(${link})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            position: "relative",
            backgroundRepeat: "no-repeat"
          }}
          className="pt-rf__file__box">
          {
            status === "loading" ?
              <div>Loading...</div> :
              !link ?
                "Select File" :
                null
          }
        </div>
        {
          !disabled ?
            <DragDrop
              uppy={uppy}
              locale={{
                strings: {
                  dropHereOr: '',
                  browse: 'Select Images'
                }
              }}
            /> :
            null
        }
      </div>
    </div>
  )
}

const MultipleFiles = ({
  links,
  removeFile,
  disabled,
  uppy
}) => {

  return (
    <div>
      <ul>
        {
          links.map((v, i) => (
            <li
              className="pt-rf__file-file"
              key={i}
              style={v.link ? {
                backgroundImage: `url(${v.link})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                position: "relative",
                backgroundRepeat: "no-repeat"
              } : {}}>
              {
                v.status === "uploading" ?
                  <div>Loading...</div> :
                  <>
                    <div className="pt-rf__file-file-backdrop"></div>
                    <i
                      onClick={() => removeFile(v.link)}
                      className="material-icons">
                      clear
                        </i>
                  </>
              }
            </li>
          ))
        }
        <li className="pt-rf__file__uppy">
          <div className="pt-rf__file__box">
            Add Files
              </div>
          {
            !disabled ?
              <DragDrop
                uppy={uppy}
                locale={{
                  strings: {
                    dropHereOr: '',
                    browse: 'Select Images'
                  }
                }}
              /> :
              null
          }
        </li>
      </ul>
    </div>
  )
}