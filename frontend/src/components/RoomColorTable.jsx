import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";

function RoomColorTable({ onColorChange }) {
  const [roomColors, setRoomColors] = useState([
    { roomType: "Living Room", color: "#FFD700" },
    { roomType: "Bedroom", color: "#ADD8E6" },
    { roomType: "Kitchen", color: "#90EE90" },
    { roomType: "Bathroom", color: "#FFB6C1" },
    { roomType: "Dining Room", color: "#FFA07A" },
  ]);

  const handleColorChange = (index, color) => {
    const updatedColors = [...roomColors];
    const isDuplicate = updatedColors.some((room, idx) => room.color === color && idx !== index);
    if (isDuplicate) {
      alert("Color already used for another room type.");
      return;
    }
    updatedColors[index].color = color;
    setRoomColors(updatedColors);
    onColorChange(updatedColors);
  };

  const handleRoomTypeChange = (index, roomType) => {
    const updatedColors = [...roomColors];
    updatedColors[index].roomType = roomType;
    setRoomColors(updatedColors);
  };

  const addRoomType = () => {
    setRoomColors([...roomColors, { roomType: "", color: "#FFFFFF" }]);
  };

  const removeRoomType = (index) => {
    const updatedColors = [...roomColors];
    updatedColors.splice(index, 1);
    setRoomColors(updatedColors);
    onColorChange(updatedColors);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Room Type and Color Selection</h3>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Room Type</th>
            <th>Color</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roomColors.map((room, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={room.roomType}
                  placeholder="Enter room type"
                  onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="color"
                  value={room.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              </td>
              <td style={{ backgroundColor: room.color, width: "50px" }}></td>
              <td>
                <Button
                  variant="danger"
                  size="bnt btn-secondary"
                  onClick={() => removeRoomType(index)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="success" onClick={addRoomType}>
        Add Room Type
      </Button>
    </div>
  );
}

export default RoomColorTable;
