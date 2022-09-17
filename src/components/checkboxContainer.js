import React, {useEffect, useState} from 'react'

export function CheckboxContainer({data, onHandleChange, seeMore}) {
    
    //const [checkbox, setCheckbox] = useState([])
    const [seeMoreState, setSeeMoreState] = useState()

    // useEffect(() => {
    //     setCheckbox(data)
    // }, [])
    
    const handleChange = (e) => {
        const {name, checked} = e.target
        //console.log(name, checked)
        
        let tempUser = data.checkbox.map(item =>
            item.name === name ? {...item, isChecked: checked} : item)
        
        //setCheckbox(tempUser)
        console.log(tempUser)
        
        onHandleChange(tempUser)
        
    }

    return (
        <div className='checkboxContainer'>
            <div
                className='body'
                style={{
                    maxHeight: seeMoreState ? 'initial' : 400,
                }}
            >
                <p className='title'>{data.title}</p>
                {
                    data.checkbox.map((item, index) => {
                        return (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    name={item.name}
                                    checked={item?.isChecked}
                                    onChange={handleChange}
                                />
                                {item.name}
                                {
                                    item.icon ?
                                        <img src={item.source} alt=""/> : null}
                            </label>
                        )
                    })
                }
            </div>
            {
                seeMore ?
                    <button className='seeMoreBtn' onClick={() => setSeeMoreState(!seeMoreState)}>
                        {
                            seeMoreState ? 'Hide' : 'See More'
                        }
                    </button> :
                    null
            }

        </div>

    )
}
