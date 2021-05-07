// handle input UI
const showInput = (hasKey: boolean) => {
  // get encrypted element
  const elEncrypted = document.querySelector('.encrypted') as HTMLElement | null
  if (elEncrypted) {
    // blur effect
    elEncrypted.style.cssText = `
                color:transparent;
                text-shadow: black 0px 0px 10px;
            `

    // create form
    const elForm = document.createElement('form')
    elForm.setAttribute('method', 'get')
    elForm.style.cssText = `
                top: 0;
                position: absolute;
                text-align: center;
                width: 320px;
                height: 172px;
                background: white;
                border: 1px solid black;
                box-sizing: border-box;
                border-radius: 8px;
                margin-top: 0;
                padding: 16px;
            `
    elEncrypted.appendChild(elForm)

    // create label
    const elLabel = document.createElement('label')
    elForm.appendChild(elLabel)

    // create label content
    const elLabelContent = document.createElement('span')
    elLabelContent.style.cssText = `
        color: black;
        text-shadow: none;
        display: flex;
        align-items: center;
    `
    elLabel.appendChild(elLabelContent)

    // create label content icon
    const elLabelContentIcon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    elLabelContentIcon.setAttribute('viewBox', '2 2 18 18')
    elLabelContentIcon.setAttribute('width', '20')
    elLabelContentIcon.setAttribute('height', '20')
    elLabelContentIcon.style.padding = '4px'

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path1.setAttribute('fill', 'grey')
    path1.setAttribute(
      'd',
      'M17 8C17 8.26522 16.8946 8.51957 16.7071 8.70711C16.5196 8.89465 16.2652 9.00001 16 9.00001C15.7348 9.00001 15.4804 8.89465 15.2929 8.70711C15.1054 8.51957 15 8.26522 15 8C15 7.73479 15.1054 7.48043 15.2929 7.29289C15.4804 7.10536 15.7348 7 16 7C16.2652 7 16.5196 7.10536 16.7071 7.29289C16.8946 7.48043 17 7.73479 17 8Z'
    )
    elLabelContentIcon.appendChild(path1)

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path2.setAttribute('fill', 'grey')
    path2.setAttribute(
      'd',
      'M14.5 4C11.424 4 9.00001 6.42401 9.00001 9.50002C9.00001 9.89702 9.04002 10.296 9.12202 10.675C9.18002 10.945 9.11402 11.179 8.98001 11.313L4.44 15.853C4.30043 15.9924 4.18973 16.158 4.11423 16.3402C4.03873 16.5224 3.99991 16.7178 4 16.915V18.5C4 18.8979 4.15804 19.2794 4.43934 19.5607C4.72065 19.842 5.10218 20 5.5 20H7.50001C7.89784 20 8.27937 19.842 8.56067 19.5607C8.84198 19.2794 9.00001 18.8979 9.00001 18.5V18H10C10.2652 18 10.5196 17.8947 10.7071 17.7071C10.8947 17.5196 11 17.2653 11 17V16H12C12.2652 16 12.5196 15.8947 12.7071 15.7071C12.8947 15.5196 13 15.2653 13 15V14.82C13.493 14.954 14.007 15 14.5 15C17.576 15 20 12.576 20 9.50002C20 6.42401 17.576 4 14.5 4ZM10 9.50002C10 6.97601 11.976 5 14.5 5C17.024 5 19 6.97601 19 9.50002C19 12.024 17.024 14 14.5 14C13.84 14 13.227 13.905 12.724 13.653C12.6478 13.6148 12.5631 13.5968 12.4779 13.6005C12.3927 13.6043 12.3099 13.6298 12.2374 13.6746C12.1648 13.7194 12.1049 13.782 12.0634 13.8565C12.0218 13.9309 12 14.0148 12 14.1V15H11C10.7348 15 10.4804 15.1054 10.2929 15.2929C10.1054 15.4805 10 15.7348 10 16V17H9.00001C8.7348 17 8.48044 17.1054 8.29291 17.2929C8.10537 17.4805 8.00001 17.7348 8.00001 18V18.5C8.00001 18.6327 7.94733 18.7598 7.85356 18.8536C7.7598 18.9474 7.63262 19 7.50001 19H5.5C5.3674 19 5.24022 18.9474 5.14645 18.8536C5.05268 18.7598 5 18.6327 5 18.5V16.914C5.00003 16.7817 5.05253 16.6547 5.146 16.561L9.68702 12.02C10.119 11.588 10.209 10.976 10.099 10.464C10.0323 10.147 9.99913 9.82393 10 9.50002Z'
    )
    elLabelContentIcon.appendChild(path2)

    elLabelContent.appendChild(elLabelContentIcon)

    // create label content text
    const elLabelContentText = document.createElement('span')
    elLabelContentText.style.cssText = `
      margin: 0 4px;
      font-size: 16px;
    `

    elLabelContentText.textContent = 'Enter key'
    elLabelContent.appendChild(elLabelContentText)

    // create input
    const elInput = document.createElement('input')
    elInput.setAttribute('type', 'password')
    elInput.setAttribute('name', paramName)

    elInput.style.cssText = `
      width: 100%;
      height: 40px;
      outline: 0;
      border-width: 0 0 1px;
      border-color: lightGrey;
      margin: 8px 0;
    `
    // prompt for wrong key
    if (hasKey) {
      elInput.setAttribute('placeholder', `wrong ${paramName}, try again`)
    } else {
      elInput.setAttribute('placeholder', 'Enter key...')
    }

    elLabel.appendChild(elInput)

    // create submit button
    const elSubmit = document.createElement('input')
    elSubmit.setAttribute('type', 'submit')
    elSubmit.style.cssText = `
      border-radius: 100px;
      width: 100%;
      height: 32px;
      color: white;
      background: dimGrey;
      border: none;
      margin: 16px 0;
    `
    elLabel.appendChild(elSubmit)
  }
}
