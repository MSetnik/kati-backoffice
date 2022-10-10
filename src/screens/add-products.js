import { MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const AddProducts = (props) => {
  const [storeSelect, setStoreSelect] = useState('')

  const { query } = useParams()

  const catalogId = query.split('&')[0].split('=')[1]
  const storeId = query.split('&')[1].split('=')[1]

  console.log(catalogId)

  return (
    <div className="container main-container">
      <div className='col col-6'>
        <div className="row">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={storeSelect}
            label="Katalog"
            onChange={setStoreSelect}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          {/* <TextField id="outlined-basic" label="katalog" variant="outlined" disabled value={catalogId}/> */}
        </div>
        <div className="row">

        </div>
        <div className="row">
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </div>
      </div>
   </div>
  )
}

export default AddProducts
