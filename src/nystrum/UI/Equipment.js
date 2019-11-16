import React from 'react';
import Button from './Button';

class Equipment extends React.Component {
  render() {
    return (
      <div className="Equipment UI">
        <div className='flow-text'>Equipment</div>
        {
          this.props.equipment && (
            this.props.equipment.map((slot, index) => {
              return (
                <Button key={index} onClick={() => null}>
                  {slot.name} {slot.item ? slot.item.renderer.character : ''}
                </Button>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Equipment;