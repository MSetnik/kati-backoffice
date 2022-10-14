/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment
} from '@mui/material'
// import SearchIcon from '@mui/icons-material/Search'

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1

const allOptions = ['Option One', 'Option Two', 'Option Three', 'Option Four']

const SearchableSelect = ({ selectOptions, selectedId, setSelectedId }) => {
  const allOptions = selectOptions

  const [selectedOption, setSelectedOption] = useState('nista')

  const [searchText, setSearchText] = useState('')
  const displayedOptions = useMemo(
    () => allOptions.filter((option) => containsText(option.name, searchText)),
    [searchText]
  )

  return (
    <Box sx={{ m: 10 }}>
      <FormControl fullWidth>
        <InputLabel id="search-select-label">Options</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          labelId="search-select-label"
          id="search-select"
          value={selectedOption}
          label="Options"
          onChange={(e) => setSelectedOption(e.target.value)}
          onClose={() => setSearchText('')}
          // This prevents rendering empty string in Select's value
          // if search text would exclude currently selected option.
          renderValue={() => selectedOption.name}
        >
          {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection. */}
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <SearchIcon /> */}
                  </InputAdornment>
                )
              }}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation()
                }
              }}
            />
          </ListSubheader>
          {displayedOptions.map((option, i) => (
            <MenuItem key={i} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SearchableSelect
