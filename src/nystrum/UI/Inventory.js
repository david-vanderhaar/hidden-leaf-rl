import React from 'react';
import Button from './Button';

class Inventory extends React.Component {
  render() {
    return (
      <div className="Inventory UI">
        <div className='flow-text'>Inventory</div>
        {
          this.props.inventory && (
            this.props.inventory.map((item, index) => {
              return (
                <Button key={index} onClick={() => null}>
                  {index} {item.name} {item.renderer.character}
                </Button>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Inventory;