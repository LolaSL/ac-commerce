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
            company: 'test1',
            experience: 5,
            portfolio: 'portfolio1.link',
        },
        {
            name: 'Test Two Company',
            email: 'test-company2@example.com',
            password: bcrypt.hashSync('test2company', 8),
            typeOfProvider: 'designer',
            phone: '1234567890',
            company: 'test2',
            experience: 7,
            portfolio: 'portfolio2.link',
        },
        {
            name: 'Test Three Company',
            email: 'test-company3@example.com',
            password: bcrypt.hashSync('test3company', 8),
            typeOfProvider: 'Architect',
            phone: '1234567890',
            company: 'test3',
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
            name: "Construction Design",
            client: "Viki Crage",
            dueDate: "2024-09-15",
            status: "In Progress",
            serviceProvider: "test-company3@example.com",
            hoursWorked: 30,
        },
        {
            name: "Loft Renovation",
            client: "Loft&Hubs Corp",
            dueDate: "2024-09-13",
            status: "Completed",
            serviceProvider: "test-company1@example.com",
            hoursWorked: 123,
        },
        {
            name: "Appartments Design",
            client: "Michaella Donowan",
            dueDate: "2024-11-23",
            status: "In Progress",
            serviceProvider: "test-company2@example.com",
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
            client: "Viki Crage",
            text: "Can we upgrade the construction layout?",
            date: "2024-09-25",
            serviceProvider: "",
        },
        {
            client: "Loft&Hubs Corp",
            text: "We obtained the last transh and last milestone",
            date: "2024-09-05",
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

            amount: 850,
            date: '2024-09-24',
            hoursWorked: 30,
            status: 'Pending',
        },
        {

            amount: 2345,
            date: '2024-09-04',
            hoursWorked: 123,
            status: 'Paid',
        },
        {

            amount: 699,
            date: '2024-09-20',
            hoursWorked: 53,
            status: 'Pending',
        },
        {

            amount: 2500,
            date: '2024-09-27',
            hoursWorked: 78,
            status: 'Paid',
        },
    ],
    blogs: [
        {
            title: "Elevate your comfort wherever you are:",
            slug: "elevate-your-comfort",
            content: "<h1>Understanding Indoor Air Quality</h1><p>Indoor air quality is an important factor to consider when evaluating the health and comfort of building residents. Indoor air quality can also be influenced by different factors such as:</p><h2>Pollutants</h2><p>Dust, pollen, pet hair, mould spores, and VOCs (volatile organic compounds) released from home products and furniture are some common indoor pollutants.</p><h2>Ventilation</h2><p>Inadequate ventilation leads to the accumulation of indoor pollutants and moisture, which creates an environment for mould and bacteria growth.</p><h2>Outdoor Air Quality</h2><p>Pollutants from outside, such as car exhausts or industrial emissions, may penetrate rooms, making them even worse than before.</p><h2>Health Risks Of Poor Indoor Air Quality</h2><p>Exposure to poor indoor air quality can have various short-term and long-term health effects. These effects can range from mild to severe, depending on the level of exposure, the types of pollutants present, and the individual’s sensitivity.</p><h3>Respiratory Issues</h3><p>Respiratory discomfort is one of the most immediate and prevalent consequences of poor indoor air quality. Pollutants, including dust mites, pet dander, and mould spores, can irritate the respiratory system, resulting in:</p><ul><li><strong>Coughing and sneezing</strong> The body uses coughs and sneezes as methods to eliminate airborne irritants.</li><li><strong>Frequent asthmatic episodes</strong> – People who have asthma might face more frequent and severe episodes because of their contact with indoor allergens and pollutants.</li><li><strong>Chronic bronchitis</strong> Chronic bronchitis, characterised by long-standing cough and excessive mucus production, may result from persistent exposure to poor indoor air quality.</li></ul><h3>Allergic Reactions</h3><p>Indoor air pollutants can act as allergens, triggering allergic reactions in many people. Common symptoms of indoor allergies include:</p><ul><li><strong>Runny or stuffy nose</strong> Allergens like dust mites and pollen can cause nasal congestion and runny nose.</li><li><strong>Itchy eyes and skin</strong> Contact with certain indoor pollutants can lead to itchy, watery eyes and skin irritation.</li><li><strong>Throat irritation</strong> Allergens and irritants can cause a sore or scratchy throat.</li></ul><h3>Headaches And Fatigue</h3><p>Poor indoor air quality may result in headaches, dizziness, and fatigue. Most of the time, this is attributed to exposure to VOCs, carbon monoxide, or other chemicals present in some household items and furniture. Later, these symptoms may become worse due to inadequate ventilation that allows pollutants to accumulate.</p><h3>Long-Term Health Effects</h3><p>Chronic hazards of poor indoor air quality can lead to severe long-term health issues, including:</p><ul><li><strong>Prolonged lasting respiratory diseases</strong> Constant exposure to indoor air pollutants can make one’s risk for chronic obstructive pulmonary disease (COPD).</li><li><strong>Cardiovascular complications</strong>  Some researchers have established a connection between bad indoor air quality and increased chances of suffering from heart disease and hypertension.</li><li><strong>Neurological effects</strong> – Certain indoor pollutants, such as lead and formaldehyde, can affect brain function over time, leading to neurodegenerative diseases.</li></ul><h2>How Your AC System Can Help Improve Indoor Air Quality</h2><p>When properly cared for, an AC system can be among the most potent devices for improving indoor air quality and reducing health dangers from polluted air. Here’s how:</p><h3>Pollutants’ Filtration</h3><p>The latest AC units come with air filters that trap dust, pollen, pet dander, and other airborne particles. These filters must be changed or cleaned regularly to keep capturing pollutants effectively. HEPA filters are very efficient in removing the smallest particles in the air, thus improving general air quality.</p><h3>Humidity Control</h3><p>Humidity levels play an important role in indoor air quality. When there is too much humidity, dust mites thrive, triggering respiratory problems or allergies. AC systems help control indoor humidity by draining excessive moisture from the air, thus preventing mould growth and decreasing the dust mite population.</p><h3>Ventilation And Circulation Of Air</h3><p>The circulation of fresh outdoor air into the house and the expulsion of stale indoor air through AC systems promote better circulation of indoor air. This process dilutes indoor pollutant concentrations, contributing to an improvement in the overall quality of indoor air. Proper ventilation is necessary in rooms with high levels of indoor pollutants, such as kitchens and bathrooms.</p><h3>Reducing VOCs And Odours</h3><p>Indoor air conditioners are known to reduce the concentration of these harmful fumes as they promote air circulation inside rooms. They have activated carbon filters that are very efficient in removing these impurities, thus transforming unhealthy and uncomfortable environments into clean and liveable spaces.</p><h2>Tips For Maintaining Your AC System For Better Air Quality</h2><h3>Regularly Change Air Filters</h3><p>Depending on how often you use it or such other factors, you should replace or clean your air filters every 1-3 months. This step ensures proper filtration of pollutants by your AC system.</p><h3>Contact Experts</h3><p>You should get an expert to check and service this equipment at least annually. The procedure helps identify everything that can destroy or affect your room’s sanity by affecting its freshening process.</p><h3>Clean The Ducts</h3><p>A build-up of dust and dirt within these ducts reduces the efficiency of your appliance and disperses impurities into the atmosphere. You can avoid this by cleaning the duct regularly.</p><h3>Dehumidification</h3><p>In humid areas, consider using a dehumidifier together with your AC system to maintain optimal humidity levels.</p><h3>Ventilation</h3><p>Make sure your home has good ventilation so that the perfect fresh air can find its way in while the stale one goes out. This can be done by using exhaust fans, leaving windows open, or installing proper ventilators.</p>",
            shortDescription: "Discover the perfect fit for your needs.",
            image: "https://www.mitsubishielectric.com.au/wp-content/uploads/2021/11/Plasma-Quad-Connect_MSZ-AP-Loungeroom-1920x1080px-1024x576.png",


        },
        {
            title: "Preventative Measures To AC.",
            slug: "preventative-measures-ac",
            content: "<h2>7 Preventative Measures To Minimise Air Conditioning Repair Needs</h2><h3>1. Regular Maintenance Checks</h3><p>Schedule regular maintenance checks with a professional to ensure your air conditioning system operates efficiently. During these checks, technicians inspect all components, clean necessary parts, and identify potential issues before they escalate into serious problems.</p><p>Regular maintenance can extend the lifespan of your unit and improve its performance. It is recommended to have maintenance checks at least once a year, ideally before the start of the cooling season.</p><p>By addressing minor issues early, you prevent them from developing into costly repairs, ensuring your system remains reliable and efficient throughout the year.</p><h3>2. Clean Or Replace Filters</h3><p>Clean or replace air filters every one to three months to maintain proper airflow and system efficiency. Dirty filters restrict airflow and force the air conditioning system to work harder, which can lead to increased energy consumption and potential breakdowns.</p> <p>Changing filters ensures clean air circulation, improves indoor air quality, and reduces the strain on your system. For homes with pets or in high-pollution areas, more frequent filter changes may be necessary.</p><p>A clean filter not only helps the system run more efficiently but also prolongs its lifespan, saving you money on energy bills and future repairs.</p><h3>3. Inspect And Clean Coils</h3><p>Ensure that both the evaporator and condenser coils are clean to maintain the efficiency of your air conditioning system. Over time, dirt and debris can accumulate on these coils, reducing their ability to absorb and release heat effectively.</p><p>Dirty coils cause the system to work harder, which leads to increased energy consumption and potential component failures. Regular cleaning, typically during annual maintenance checks, helps maintain optimal performance and energy efficiency.</p><p>Furthermore, clean coils ensure better heat exchange, lower energy bills, and a longer lifespan for your system. Maintaining them is crucial for preventing unnecessary wear and tear on your air conditioning unit.</p><h3>4. Check Thermostat Settings</h3><p>Verify that your thermostat settings are accurate and suited to your comfort needs. Incorrect settings can cause the air conditioning system to cycle on and off frequently, leading to increased wear and tear and higher energy bills.</p> <p>Consider upgrading to a programmable thermostat for better control and energy efficiency. A programmable thermostat allows you to set different temperatures for various times of the day. This ensures optimal comfort while reducing unnecessary usage.</p><h3>5. Clear Debris From Around The Unit</h3><p>Keep the area around your outdoor unit free from debris such as leaves, grass, and other obstructions. These items can impede airflow, causing the system to work harder and potentially overheat.</p><p>Maintaining a clear space of at least two feet around the unit ensures proper airflow and efficient operation. Check the area on a regular basis and remove any debris that may accumulate. Proper airflow is essential for the system to release heat effectively, which is critical for maintaining optimal performance.</p><h3>6. Ensure Proper Refrigerant Levels</h3><p>Have a professional check the refrigerant levels in your air conditioning system regularly. Low refrigerant levels can cause the system to overheat and fail.</p><p>Proper refrigerant levels are also crucial for preventing damage to the compressor. If your system is low on refrigerant, it may indicate a leak that needs to be addressed immediately.</p><p>Periodic checks ensure that your system has the correct amount of refrigerant, which is vital for maintaining cooling efficiency and preventing strain on the unit.</p><h3>7. Check And Tighten Electrical Connections</h3><p>Over time, electrical connections within your air conditioning system can become loose. This may lead to potential system failures and safety hazards. Regularly check and tighten these connections to ensure reliable operation.</p><p>During routine maintenance checks, professionals will examine these connections to ensure they are secure and functioning correctly. Keeping electrical connections tight prevents unnecessary wear on the system and helps avoid costly repairs.</p><p>This simple yet crucial step enhances the overall reliability and safety of your air conditioning unit.</p></section><section ><h2>JP Air Conditioning – For Expert Installation, Servicing, Repairs</h2><p>At JP Air Conditioning, we pride ourselves on being London’s premier air conditioning experts with over 15 years’ experience in the field. Our comprehensive services cover all aspects of air conditioning, from installation and servicing to repairs, ensuring your building remains comfortable year-round.</p><p>Rest assured, our skilled engineers are dedicated to meeting your needs, whether through regular servicing or one-off maintenance visits. We work around your schedule, offering flexible service times to minimise disruption to your home or business operations.</p><p>Finally, at the end of each servicing, we provide a detailed, written report, signed by our engineer, outlining any additional repairs that might be necessary.</p>",
            shortDescription: "Preventative Measures To Minimise Air Conditioning Repair Needs.",
            image: "https://assets.fixr.com/cost_guides/annual-air-conditioner-maintenance/annual-air-conditioner-maintenance-5ed7b071349f8.png",

        },
        {
            title: "What Temperature Should You Set The Air Conditioner in Summer?",
            slug: "what-temperature-of-ac",
            content: "<h2>What is the Ideal AC Temperature for Summer?</h2><p> Well, the prime thing to bear in your mind is that there is a perfect temperature at which you can set your thermostat during the summer months. However, you cannot keep it at the same temperature during the day and night.</p><p>The temperature has to vary. If we talk about the temperature during the day, the general rule is to keep a difference of -6.6 degrees Celsius between the indoor and outdoor temperatures. This should be done to ensure that if you have to go outdoors, the temperature difference is easily bearable by the body.</p> <h3>Best Temperature for Day!</h3><p>The best temperature to run your AC during the day is 27 to 29 degrees Celsius. If you run your AC between or at these temperatures for eight hours, you can easily save 5-15% on the overall cooling cost.</p><p>Though this is an ideal setting for the AC temperature, the required AC temperature can vary a little based on various factors. These factors are the location of your house, the insulation of your house, the time of the day, etc. In areas like London, the ideal AC temperature is between 21 to 25 degrees Celsius.</p><h3>Best Temperature for Night!</h3> <p>When it comes to nighttime, the temperature outdoors drops during the night, which is why you need to lower the AC temperature. The ideal temperature to set your AC to at night is 15 and 19 degrees Celsius. It is better to use sleep mode on your AC as it will turn OFF the AC after some time, saving you money.</p><h3>Can I Automate the Temperature Settings of the Air Conditioner?</h3><p>If you are a working-class person, it can be a bit inconvenient to turn the AC ON and OFF repeatedly. Moreover, keeping track of the temperature and adjusting it after coming from work can be irritating. This is where the need for automation or a programmable thermostat comes into the picture.</p><p>A programmable thermostat is an excellent device that can help keep your home at the right temperature while you are away. For example, if you are out, it will keep the temperature higher and reduce it to your set value when you are ready to come home. The device can be a great way to save more power.</p><h3>Essential Tips to Obtain the Best Out of Your AC in Summers!</h3><p> Ok, now we know what the ideal temperature for your AC for this summer is. But, it is not going to be enough. You will reap no benefits from setting the AC at 25 or 26 degrees Celsius if you haven’t taken care of the other factors.</p><p>So, here are some tips that you need to implement to get the best air conditioning installation this summer.</p><ul><li> <strong>Use a ceiling fan:</strong> Using an AC is not going to be enough if you want to cool in multiple rooms. Cool air is heavy, which is why it accumulates wherever it is released. Therefore, it is necessary to have a ceiling fan that circulates the air. This will significantly affect your power bill.</li> <li><strong>Keep the doors and windows closed:</strong> Your AC will not deliver performance if you leave the doors & windows open. You see, the AC captures the hot air in the room, cools it, and releases it back into the house. Hence, if the hot air outside is coming inside, the overall cooling effect will be hampered. </li><li><strong>Keep a check on the air filters:</strong> No matter what temperature your AC is set to, if the filters used in the AC are not clean, your AC will require more power to suck the air in and deliver cold air out. Hence, if your AC has removable filters, take them out and clean them on a regular basis.</li> </ul><p>Keep all these things in mind, and you will never face high power bills due to your AC, at least.</p>",
            shortDescription: "What is the Ideal AC Temperature for Summer?",
            image: "https://blog.waltonbd.com/wp-content/uploads/2022/04/5-What-Temperature-Should-I-set-my-AC-during-summer.jpg",
        },
        {
            title: " Problems With Air Conditioner And Tips To Prevent Them.",
            slug: "3-common-air-conditioning-problems",
            content: " <h2>What is the Ideal AC Temperature for Summer?</h2> <p> The prime thing to bear in your mind is that there is a perfect temperature at which you can set  thermostat during the summer months. However, you cannot keep it at the same temperature during the day and night.</p> <p>The temperature has to vary. If we talk about the temperature during the day, the general rule is to keep a difference of -6.6 degrees Celsius between the indoor and outdoor temperatures. This should be done to ensure that if you have to go outdoors, the temperature difference is easily bearable by the body.</p><h3>Best Temperature for Day!</h3><p>The best temperature to run your AC during the day is 27 to 29 degrees Celsius. If you run your AC between or at these temperatures for eight hours, you can easily save 5-15% on the overall cooling cost. </p><p>Though this is an ideal setting for the AC temperature, the required AC temperature can vary a little based on various factors. These factors are the location of your house, the insulation of your house, the time of the day, etc. In areas like London, the ideal AC temperature is between 21 to 25 degrees Celsius.</p><h3>Best Temperature for Night!</h3><p>When it comes to nighttime, the temperature outdoors drops during the night, which is why you need to lower the AC temperature. The ideal temperature to set your AC to at night is 15 and 19 degrees Celsius. It is better to use sleep mode on your AC as it will turn OFF the AC after some time, saving you money.</p><h3>Can I Automate the Temperature Settings of the Air Conditioner?</h3><p>If you are a working-class person, it can be a bit inconvenient to turn the AC ON and OFF repeatedly. Moreover, keeping track of the temperature and adjusting it after coming from work can be irritating. This is where the need for automation or a programmable thermostat comes into the picture.</p><p>A programmable thermostat is an excellent device that can help keep your home at the right temperature while you are away. For example, if you are out, it will keep the temperature higher and reduce it to your set value when you are ready to come home. The device can be a great way to save more power.</p><h3>Essential Tips to Obtain the Best Out of Your AC in Summers!</h3><p>Ok, now we know what the ideal temperature for your AC for this summer is. But, it is not going to be enough. You will reap no benefits from setting the AC at 25 or 26 degrees Celsius if you haven’t taken care of the other factors.</p><p>So, here are some tips that you need to implement to get the best air conditioning installation this summer.</p><ul><li><strong>Use a ceiling fan:</strong> Using an AC is not going to be enough if you want to cool in multiple rooms. Cool air is heavy, which is why it accumulates wherever it is released. Therefore, it is necessary to have a ceiling fan that circulates the air. This will significantly affect your power bill.</li><li><strong>Keep the doors and windows closed:</strong> Your AC will not deliver performance if you leave the doors & windows open. You see, the AC captures the hot air in the room, cools it, and releases it back into the house. Hence, if the hot air outside is coming inside, the overall cooling effect will be hampered.</li><li><strong>Keep a check on the air filters:</strong> No matter what temperature your AC is set to, if the filters used in the AC are not clean, your AC will require more power to suck the air in and deliver cold air out. Hence, if your AC has removable filters, take them out and clean them on a regular basis.</li></ul><p>Keep all these things in mind, and you will never face high power bills due to your AC, at least.</p><h2>Common Problems with Air Conditioners</h2><p>With the summer months comes the summer heat. On a sweltering day with temperatures reaching triple digits and 100 percent humidity, the last thing anyone wants to deal with is a broken air conditioner. Here are some common problems many encounter with their air conditioners and tips to prevent them from happening to you. </p><h3>Just Plain Dirty</h3><p>One of the most common problems air conditioners face stems from the fact they are just plain dirty. Dirt can cause some serious issues when they build up in the air filter and on the coils. When this happens, the airflow from the machine into the room will decrease, and the unit will literally freeze, shutting down.</p><p>This problem can best be prevented by basic maintenance with regular cleaning of the filter and coils. Keeping the buildup of dirt and dust to a minimum will ensure your air conditioner can do its best in the hot months ahead.</p><h3>Leaking Refrigerant</h3> <p> Refrigerant is the lifeblood in your air conditioner that helps the hot and wet air around you become that nice cool and dry air you enjoy. A common problem is a leak in the tubing of the air conditioner that holds the refrigerant.</p><p>When the level of refrigerant is at the exact level recommended by manufacturers, the machine will work at its best. When there is more or less refrigerant than that level, the machine will not work at its best. If you add more refrigerant to your air conditioner with no improvement to the quality of air that comes out, you might have a leak. The best way to fix this problem is to call a professional who will be able to repair the leak and get your HVAC system back to the right levels again. With refrigerant distribution strictly controlled by our government, you cannot continue to re-charge a leaking system.</p><h3>Electric Control Failure</h3><p>If you tend to turn your air conditioner on and off frequently, a problem can develop with the electric controls. When the weather is hot and humid, you should leave the system on and just raise the temperature a maximum of 5 degrees when not home. If you think the unit is not keeping the temperature you wish, an electrical problem as simple as your thermostat may be the culprit.</p>",
            shortDescription: "3 Common Air Conditioning Problems And Tips To Prevent Them.",
            image: "https://metropha.com/wp-content/uploads/2018/03/How-to-Deal-with-Air-Conditioner-Issues-Air-Conditioner-Repair-in-Chattanooga-TN.jpg",
        }

    ]
}

export default data;