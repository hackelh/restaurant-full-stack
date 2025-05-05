import { useState } from 'react'
import './DataTable.css'
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa'

function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onAdd,
  title,
  searchable = true 
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>{title}</h2>
        <div className="table-actions">
          {searchable && (
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <button className="add-button" onClick={onAdd}>
            <FaPlus /> Ajouter
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.field}>{column.header}</th>
              ))}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`${item.id}-${column.field}`}>
                    {column.render ? column.render(item[column.field]) : item[column.field]}
                  </td>
                ))}
                <td className="actions-cell">
                  <button className="action-button edit" onClick={() => onEdit(item)}>
                    <FaEdit />
                  </button>
                  <button className="action-button delete" onClick={() => onDelete(item)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
