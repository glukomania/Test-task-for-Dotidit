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

    if (props.headers.filter(item => item.isVisible).length > 1) {        //logic to prevent the whole table disappearing
      const selectedHeader = props.headers.find((header: Header) => header.Header === name)
      const newSelectedHeader = {...selectedHeader, isVisible: !selectedHeader.isVisible}
  
      const newHeaders = props.headers.map((header: Header) => (header.Header === newSelectedHeader.Header ? newSelectedHeader : header));
  
      props.setHeaders(newHeaders)
      
    } else {
      const selectedHeader = props.headers.find((header: Header) => header.Header === name)
      if (!selectedHeader.isVisible) {
        const newSelectedHeader = {...selectedHeader, isVisible: !selectedHeader.isVisible}
  
        const newHeaders = props.headers.map((header: Header) => (header.Header === newSelectedHeader.Header ? newSelectedHeader : header));
    
        props.setHeaders(newHeaders)
      }
    }
  }

  return (
    <div className="menu">
      <div className="blur" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)}/>
      <div className="menu__content">
        <div className='menu__header'>{props.header}</div>
          <ul>
            {props.headers.map((item: Header) => {
              return (<div key={item.Header} className="menuitem">
                        <label>
                          <input
                            type="checkbox"
                            checked={item.isVisible}
                            onChange={() => onColumnToggle(item.Header)}
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