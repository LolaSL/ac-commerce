import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Admin',
            email: 'admin_uniqueA@example.com',
            password: bcrypt.hashSync('55555'),
            isAdmin: true,
        },
        {
            name: 'Jane',
            email: 'user_doe@example.com',
            password: bcrypt.hashSync('123'),
            isAdmin: false,
        },
        { name: "User1", email: "user1@example.com", password: "password123" },
        { name: "User2", email: "user2@example.com", password: "password234" },
    ],
    products: [
        {
            name: "10.000 BTU Window Air Conditioner",
            slug: "btu-dual-inverter-air-conditioner",
            category: "Window Air Conditioner",
            image: "/images/p1.jpg",
            price: 449,
            countInStock: 10,
            brand: "LG",
            rating: 4.5,
            numReviews: 5,
            description: "10.000 BTU, Estimated Cooling Area 450 sq. ft. Automatically restarts minutes after power is restored when a power failure occurs. LoDecibel™ Quiet Operation, LG ThinQ® Technology. The Clean Filter Alert lets you know when it’s time to clean. Simply remove the filter to wash. Make temperature adjustments and fan speed selection on the easy to use control panel or remote. This Dual Inverter ENERGY STAR® unit meets the EPA's standards for energy efficiency and savings.",
            features: "Energy Saving",
            btu: 10000,
            areaCoverage: 450,
            energyEfficiency: 12
        },
        {


            name: "8.000 BTU Window Air Conditioner",
            slug: "btu-window-air-conditioner",
            category: "Window Air Conditioner",
            image: "/images/p2.jpg",
            price: 279,
            countInStock: 8,
            brand: "LG",
            rating: 3.5,
            numReviews: 4,
            description: "8.000 BTU, Estimated Cooling Area 350 Sq. Ft, 115 Volt, Window Installation Kit, Slide Out Washable Filter & Filter Alert, 2 Fan Speed Cooling, Energy Saver Function.",
            features: "Remote Control",
            btu: 8000,
            areaCoverage: 350,
            energyEfficiency: 9

        },
        {

            name: "12.000 BTU Window Air Conditioner",
            slug: "btu-dual-inverter-smart-air-conditioner",
            category: "Window Air Conditioner",
            image: "/images/p3.jpg",
            price: 529,
            countInStock: 12,
            brand: "LG",
            rating: 0,
            numReviews: 1,
            description: "12.000 BTU, Estimated Cooling Area 550 sq. ft., 115 Volt, ENERGY STAR Certified, Window Installation Kit, Slide-Out Washable Filter & Filter Alert, 3 Fan Speed Cooling.",
            features: "Wi-Fi",
            btu: 12000,
            areaCoverage: 550,
            energyEfficiency: 10

        },
        {

            name: "6.000 BTU Portable Air Conditioner",
            slug: "btu-portable-air-conditioner",
            category: "Portable Air Conditioner",
            image: "/images/p4.jpg",
            price: 329,
            countInStock: 2,
            brand: "LG",
            rating: 2.5,
            numReviews: 3,
            description: "6.000 BTU (US DOE)/ 10,000 BTU (ASHRAE)*, 3-in-1 Operation (Cool/Dehumidify/Fan), Auto Swing Air Vent, Installation Kit Included, Estimated Cooling Area 250 Sq. Ft.",
            features: "Remote Control",
            btu: 6000,
            areaCoverage: 250,
            energyEfficiency: 8
        }
    ],
    sellers: [
        {

            name: 'LG',
            brand: "LG",
            rating: 4.5,
            info: "Lg is the one of popular and ",
            numReviews: 15,
            isAdmin: false,
        },
        {

            name: 'Siemens',
            brand: "Siemens",
            info: "Siemens is the one of popular and ",
            rating: 3.5,
            numReviews: 13,
            isAdmin: false,
        },
    ],
    contacts: [
        {

            fullName: 'Test One',
            email: "test_one@example.com",
            subject: "test one",
            message: "Test ONE",

        },
        {

            fullName: 'Test Two',
            email: "test_two@example.com",
            subject: "test Two",
            message: "Test TWO",

        },
    ],
    serviceProviders: [
        {
            name: 'Test One Company',
            email: 'test-company1@example.com',
            password: bcrypt.hashSync('12345', 8),
            typeOfProvider: 'designer',
            phone: '1234567890',
            company: 'test-company1',
            experience: 5,
            portfolio: 'portfolio1.link',
        },
        {
            name: 'Test Two Company',
            email: 'test-company2@example.com',
            password: bcrypt.hashSync('test2company', 8),
            typeOfProvider: 'designer',
            phone: '1234567890',
            company: 'test-company2',
            experience: 7,
            portfolio: 'portfolio2.link',
        },
        {
            name: 'Test Three Company',
            email: 'test-company3@example.com',
            password: bcrypt.hashSync('test3company', 8),
            typeOfProvider: 'Architect',
            phone: '1234567890',
            company: 'test-company3',
            experience: 9,
            portfolio: 'portfolio3.link',
        },
    ],
    projects: [
        {
            name: "Residential House Design",
            client: "John Doe",
            dueDate: "2024-09-23",
            status: "In Progress",
            serviceProvider: "test-company1@example.com",
            hoursWorked: 20,
        },
        {
            name: "Office Interior Renovation",
            client: "ABC Corp",
            dueDate: "2024-09-10",
            status: "Completed",
            serviceProvider: "test-company2@example.com",
            hoursWorked: 40,
        },
        {
            name: "Appartments Design",
            client: "Michaella Donowan",
            dueDate: "2024-11-23",
            status: "In Progress",
            serviceProvider: "test-company3@example.com",
            hoursWorked: 53,
        },
        {
            name: "Ventilation System Architecting",
            client: "Venty Corp",
            dueDate: "2024-09-26",
            status: "Paid",
            serviceProvider: "test-company3@example.com",
            hoursWorked: 78,
        },
    ],
    messages: [
        {
            client: "ABC Corp",
            text: "Can we upgrade the office layout?",
            date: "2024-09-26",
            serviceProvider: "",
        },
        {
            client: "Venty Corp",
            text: "When will we get the first transh for the first draft and previous milestone?",
            date: "2024-09-15",
            serviceProvider: "",
        },
        {
            client: "John Doe",
            text: "Can we update the room layout?",
            date: "2024-08-18",
            serviceProvider: "",
        },
        {
            client: "Michaella Donowan",
            text: "When can we start nogotiation regarding the first draft be ready?",
            date: "2024-09-20",
            serviceProvider: "",
        },
    ],
    earnings: [
        {
    
            amount: 500,
            date: '2024-09-20',
            hoursWorked: 20,
            status: 'Pending',
        },
        {
       
            amount: 1500,
            date: '2024-09-29',
            hoursWorked: 40,
            status: 'Paid',
        },
        {
           
            amount: 699,
            date: '2024-09-20',
            hoursWorked:53,
            status: 'Pending',
        },
        {
       
            amount: 2500,
            date: '2024-09-27',
            hoursWorked: 78,
            status: 'Paid',
        },
    ]
}

export default data;