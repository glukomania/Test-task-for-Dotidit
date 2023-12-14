import * as React from 'react'
import {useEffect} from 'react'

type Header = {
  Header: string
  accessor: string
  isVisible: boolean
}

type MenuProps = {
  headers: Header[]
  setHeaders: (newHeaders: Header[]) => void;
  header: string
  setIsMenuOpen: (arg0: boolean) => void;
  isMenuOpen: boolean
}

const Menu = (props: MenuProps) => {

  const onColumnToggle = (name: string) => {
    const selectedHeader = props.headers.find((header: Header) => header.Header === name)
    const newSelectedHeader = {...selectedHeader, isVisible: !selectedHeader.isVisible}

    const newHeaders = props.headers.map((header: Header) => (header.Header === newSelectedHeader.Header ? newSelectedHeader : header));

    console.log('newHeaders', newHeaders)
    props.setHeaders(newHeaders)
  }

  useEffect(() => {
    console.log('Menu has been rendered')
  }, [])

  return (
    <div className="menu">
      <div className="blur" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)}/>
      <div className="menu__content">
        <div className='menu__header'>{props.header}</div>
          <ul>
            {props.headers.map((item: Header) => {
              return (<div key={item.Header}>
          <label>
            <input
              type="checkbox"
              checked={item.isVisible}
              onChange={() => onColumnToggle(item.Header)}
            />
            {item.Header}
          </label>
        </div>)}
        )}
          </ul>
      </div>
    </div>
  )
}

export default Menu