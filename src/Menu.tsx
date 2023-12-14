import * as React from 'react'

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

    props.setHeaders(newHeaders)
  }

  return (
    <div className="menu">
      <div className="blur" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)}/>
      <div className="menu__content">
        <div className='menu__header'>{props.header}</div>
          <ul>
            {props.headers.map((item: Header) => {
              return (item.Header !== 'Id' && <div key={item.Header} className="menuitem">
                        <label>
                          <input
                            type="checkbox"
                            checked={item.isVisible}
                            onChange={() => onColumnToggle(item.Header)}
                            disabled={item.Header === 'Name'}
                            className='checkbox'
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