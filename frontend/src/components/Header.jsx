import React from 'react';

export default function Header() {
    return (
        <header style={{ paddingLeft: 0 }}>
            <div
                className='p-5 text-center responsive banner '
                style={{ backgroundImage: `url("/images/home4.jpg")`,
                    height: 700,
                    backgroundSize: 'cover', 
                    objectFit: 'cover', 
                    backgroundRepeat: 'no-repeat'}}
            >
                <div className='mask'
                >
                    <div className=' d-flex justify-content-center align-items-center  h-100'>
                        <div className=" header">
                            <h1 className='header-title mb-3'>Discover The Ultimate Air</h1>
                            <h3 className='header-info text-white mb-3'>Experience the perfect balance of comfort and energy efficiency with our state-of-the-art air</h3>
                        </div>
                    </div>
                </div>
          </div>
        </header>
    );
}

