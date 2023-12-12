import * as React from 'react';

const Menu = (props) => {

  const onColumnToggle = (name) => {
    console.log('name', name)
    const selectedHeader = props.headers.find(header => header.Header === name)
    console.log('selectedHeader', selectedHeader)
    const newSelectedHeader = {...selectedHeader, isVisible: !selectedHeader.isVisible}
    console.log('new Headers', newSelectedHeader)

    const newHeaders = props.headers.map(header => (header.Header === newSelectedHeader.Header ? newSelectedHeader : header));
    console.log('newHeaders', newHeaders)
    props.setHeaders(newHeaders)
  }
  return (
    <div className="menu">
      <div className="blur" onClick={() => props.setIsMenuOpen(!props.isMenuOpen)}/>
      <div className="menu__content">
        <div className='menu__header'>{props.header}</div>
          <ul>
            {props.items.map(item => {
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