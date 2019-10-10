import React from 'react';

class Inventory extends React.Component {
  render() {
    return (
      <div className="Inventory">
        {
          this.props.inventory && (
            this.props.inventory.map((item, index) => {
              return <button 
                key={index} 
                onClick={() => null} 
                className='btn'>
                  {item.name}
                </button>
            })
          )
        }
      </div>
    );
  }
}

export default Inventory;