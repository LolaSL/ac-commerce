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
      name: "10000 BTU Window AC",
      slug: "btu-dual-inverter-air-conditioner",
      category: "Window Air Conditioner",
      image: "/images/p1.jpg",
      price: 449,
      countInStock: 10,
      brand: "LG",
      rating: 4.5,
      numReviews: 5,
      description: "10000 BTU, Estimated Cooling Area 450 sq. ft. Automatically restarts minutes after power is restored when a power failure occurs. LoDecibel™ Quiet Operation, LG ThinQ® Technology. The Clean Filter Alert lets you know when it’s time to clean. Simply remove the filter to wash. Make temperature adjustments and fan speed selection on the easy to use control panel or remote. This Dual Inverter ENERGY STAR® unit meets the EPA's standards for energy efficiency and savings.",
      features: "Energy Saving",
      btu: 10000,
      areaCoverage: 16,
      energyEfficiency: 9,
      documents: [
        {
          url: "https://www.lg.com/us/support/product/lg-LW1016ER.AC1AUSB",
          type: "HTML",
          description: "User Manual for LG 10000 BTU Window AC",
        },
        {
          url: "https://www.lg.com/us/air-conditioners/lg-lw1022ivsm-window-air-conditioner",
          type: "HTML",
          description: "Technical Specifications for LG 10000 BTU Window AC",
        },
        {
          url: "https://gscs.lge.com/gscs/support/fileupload/downloadFile.do?fileId=WK0K7TKOXp639VkW44X2Q&portalId=P1",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
    {
      name: "8000 BTU Window AC",
      slug: "btu-window-air-conditioner",
      category: "Window Air Conditioner",
      image: "/images/p2.jpg",
      price: 279,
      countInStock: 8,
      brand: "LG",
      rating: 3.5,
      numReviews: 4,
      description: "8000 BTU, Estimated Cooling Area 350 Sq. Ft, 115 Volt, Window Installation Kit, Slide Out Washable Filter & Filter Alert, 2 Fan Speed Cooling, Energy Saver Function.",
      features: "Remote Control",
      btu: 8000,
      areaCoverage: 13,
      energyEfficiency: 8,
      documents: [
        {
          url: "https://www.lg.com/us/support/product/lg-LW8016ER.AC1AUSB",
          type: "HTML",
          description: "User Manual for LG 8000 BTU Window AC",
        },
        {
          url: "https://www.lg.com/us/air-conditioners/lg-lw8024r-window-air-conditioner",
          type: "HTML",
          description: "Technical Specifications for LG 8000 BTU Window AC",
        },
        {
          url: "https://gscs.lge.com/gscs/support/fileupload/downloadFile.do?fileId=WK0K7TKOXp639VkW44X2Q&portalId=P1",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],

    },
    {
      name: "12000 BTU Window AC",
      slug: "btu-dual-inverter-smart-air-conditioner",
      category: "Window Air Conditioner",
      image: "/images/p3.jpg",
      price: 529,
      countInStock: 12,
      brand: "LG",
      rating: 0,
      numReviews: 1,
      description: "12000 BTU, Estimated Cooling Area 550 sq. ft., 115 Volt, ENERGY STAR Certified, Window Installation Kit, Slide-Out Washable Filter & Filter Alert, 3 Fan Speed Cooling.",
      features: "Wi-Fi",
      btu: 12000,
      areaCoverage: 20,
      energyEfficiency: 10,
      documents: [
        {
          url: "https://www.lg.com/us/support/product/lg-LW1216ER.AC1AUSB",
          type: "HTML",
          description: "User Manual for LG 12000 BTU Window AC",
        },
        {
          url: "https://www.lg.com/us/air-conditioners/lg-lw1216er-window-air-conditioner",
          type: "HTML",
          description: "Technical Specifications for LG 12000 BTU Window AC",
        },
        {
          url: "https://gscs.lge.com/gscs/support/fileupload/downloadFile.do?fileId=WK0K7TKOXp639VkW44X2Q&portalId=P1",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],

    },
    {
      name: "6000 BTU Portable AC",
      slug: "btu-portable-air-conditioner",
      category: "Portable Air Conditioner",
      image: "/images/p4.jpg",
      price: 329,
      countInStock: 2,
      brand: "LG",
      rating: 2.5,
      numReviews: 3,
      description: "6000 BTU (US DOE)/ 10,000 BTU (ASHRAE)*, 3-in-1 Operation (Cool/Dehumidify/Fan), Auto Swing Air Vent, Installation Kit Included, Estimated Cooling Area 250 Sq. Ft.",
      features: "Remote Control",
      btu: 6000,
      areaCoverage: 10,
      energyEfficiency: 8,
      documents: [
        {
          url: "https://www.lg.com/us/support/product/lg-LP0621WSR.AWYAOSH",
          type: "HTML",
          description: "User Manual for LG 6000 BTU Portable AC",
        },
        {
          url: "https://www.lg.com/us/air-conditioners/lg-lw6024rsmx-window-air-conditioner",
          type: "HTML",
          description: "Technical Specifications for LG 6000 BTU Portable AC",
        },
        {
          url: "https://gscs.lge.com/gscs/support/fileupload/downloadFile.do?fileId=WK0K7TKOXp639VkW44X2Q&portalId=P1",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
    {
      name: "18000 BTU Mini Split AC Heat Pump",
      slug: "18000-btu-Mini-Split-air-conditioner",
      category: "Mini Split AC",
      image: "/images/p5.jpg",
      price: 899.99,
      countInStock: 4,
      brand: "Senville",
      rating: 4.5,
      numReviews: 139,
      description: "18000 BTU Mini Split Air Conditioner and Heat Pump System, LETO Series by Senville offers you an efficient way to heat and cool any room. 19 SEER (HE) High Efficiency Air Conditioner & Heater. With Built-In Heat Pump (Up to -15C / 5F) Suitable for Most Climates. DC Inverter Technology for Minimal Energy Consumption (Up to 48% Savings per Year). Built-In De-humidification Function, Fan and Turbo Function for Complete Climate Control. Recommended for rooms sized 700-1000 sq. ft. Requires professional installation.",
      features: "Remote Control",
      btu: 18000,
      areaCoverage: 100,
      energyEfficiency: 12,
      documents: [
        {
          url: "https://manuals.plus/senville/18000-btu-floor-mounted-mini-split-heat-pump-manual",
          type: "HTML",
          description: "User Manual for Senville 18000 BTU Mini Split AC",
        },
        {
          url: "https://senville.com/18000-btu-mini-split-air-conditioner-sena-18hf/",
          type: "HTML",
          description: "Technical Specifications for Senville 18000 BTU Mini Split AC",
        },
        {
          url: "https://manuals.plus/wp-content/uploads/2023/08/Senville-18000-BTU-Floor-Mounted-Mini-Split-Heat-Pump-Instruction-Manual_2.png",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
    {
      name: "24000 BTU Mini Split AC Heat Pump",
      slug: "24000-btu-Mini-Split-air-conditioner",
      category: "Mini Split AC",
      image: "/images/p6.jpg",
      price: 872.19,
      countInStock: 4,
      brand: "Towallmark",
      rating: 3.5,
      numReviews: 39,
      description: "24000 Efficient Mini Split AC Cooling & Heating System: With 24,000 BTUs and a 23 SEER2 rating, 208/230V, our split air conditioner provides cooling and heating capabilities, ensuring optimal temperature control in any season. This pre-charged air conditioner unit features a ductless mini split inverter plus system with a heat pump and DC Inverter technology providing up to 30% power savings.",
      features: "Remote Control",
      btu: 24000,
      areaCoverage: 139,
      energyEfficiency: 13,
      documents: [
        {
          url: "https://www.walmart.com/ip/Towallmark-24000-BTU-Mini-Split-AC-19-SEER2-Wall-Mounted-AC-Heat-Pump-Installation-Kits-Ductless-Inverter-Split-System-Air-Conditioners-Cools-450-Sq/5120904200",
          type: "HTML",
          description: "User Manual for Towallmark 24000 BTU  Mini Split AC",
        },
        {
          url: "https://www.thermospace.com/ductless_split/24000_btu_mini_inverter_split_air_conditioner.php",
          type: "HTML",
          description: "Technical Specifications for Towallmark 24000 BTU  Mini Split AC",
        },
        {
          url: "https://manuals.plus/wp-content/uploads/2023/08/Senville-18000-BTU-Floor-Mounted-Mini-Split-Heat-Pump-Instruction-Manual_2.png",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
    {
      name: "30000 BTU Mini Split AC Heat Pump",
      slug: "30000-btu-Mini-Split-air-conditioner",
      category: "Mini Split AC",
      image: "/images/p7.jpg",
      price: 6914,
      countInStock: 1,
      brand: "Daikin",
      rating: 3,
      numReviews: 30,
      description: "Daikin 30000 Btu 20.2 Seer 4-Zone Mini Split Heat Pump System - 7K-7K-7K-9K - 5MXS48TVJU - (3) CTXS07LVJU - FTXS09LVJU",
      features: "Remote Control",
      btu: 30000,
      areaCoverage: 180,
      energyEfficiency: 14,
      documents: [
        {
          url: "https://daikincomfort.com/operationmanuals",
          type: "HTML",
          description: "User Manual for Daikin 30000 BTU  Mini Split AC",
        },
        {
          url: "https://theductco.com/products/daikin-30000-btu-16-seer-mini-split-concealed-duct-and-heat-pump-fbq30pvju-single-zone-p-series",
          type: "HTML",
          description: "Technical Specifications for Daikin 30000 BTU  Mini Split AC",
        },
        {
          url: "https://manuals.plus/wp-content/uploads/2023/08/Senville-18000-BTU-Floor-Mounted-Mini-Split-Heat-Pump-Instruction-Manual_2.png",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
    {
      name: "16000 BTU Mini Split AC Heat Pump ",
      slug: "16000-btu-Mini-Split-air-conditioner",
      category: "Mini Split AC",
      image: "/images/p8.jpg",
      price: 699.99,
      countInStock: 2,
      brand: "Costway",
      rating: 2,
      numReviews: 20,
      description: " This 16000 BTU split-system AC unit has 5 working modes for you to choose from: auto, cool, dry, heat and fan mode. In addition, this split air conditioner also comes with 4 available fan speeds (low/medium/high/auto), sleep mode, ECO mode, iFEEL & turbo function to meet various needs.",
      features: "Remote Control",
      btu: 16000,
      areaCoverage: 110,
      energyEfficiency: 11,
      documents: [
        {
          url: "https://manuals.plus/costway/16000btu-4-portable-hot-and-cold-air-conditioner-manual",
          type: "HTML",
          description: "User Manual for Costway 16000 BTU  Mini Split AC",
        },
        {
          url: "https://www.walmart.com/tp/16000-btu-air-conditioners",
          type: "HTML",
          description: "Technical Specifications for Costway 16000 BTU  Mini Split AC",
        },
        {
          url: "https://blog.costway.com/zb_users/upload/2024/07/202407221721717298238921.png",
          type: "Image",
          description: "Installation Guide Image",
        },
      ],
    },
  ],

  sellers: [
    {
      name: 'LG',
      brand: "LG",
      rating: 4.5,
      info: "LG offers optimized Heating, Ventilation, and Air Conditioning for both commercial and residential solutions, ensuring fresh and crisp air for various environments.",
      numReviews: 15,
      isAdmin: false,
    },
    {
      name: 'Towalmark',
      brand: "Towalmark",
      info: "Experience superior comfort with our energy-efficient Split Air Conditioner, designed to deliver powerful cooling while minimizing electricity usage. Its quiet operation and sleek, modern design blend seamlessly into your living space, enhancing your home's ambiance. Offering flexible and customizable cooling options, advanced air filters for healthier air, and smart features like remote Wi-Fi control, our Split Air Conditioner is the perfect solution for maintaining an ideal indoor climate while reducing your environmental footprint.",
      rating: 4.0,
      numReviews: 13,
      isAdmin: false,
    },
    {
      name: 'Senville',
      brand: "Senville",
      info: "Senville.com is a leading retailer of mini split air conditioners and efficient heating and cooling products. Established in 2005, we've been helping to reduce energy consumption in home and businesses for over 10 years.",
      rating: 3.0,
      numReviews: 8,
      isAdmin: false,
    },
    {
      name: 'Daikin',
      brand: "Daikin",
      info: "The world's leading air conditioning manufacturer—Daikin. The source of the company's steady growth is its world-class air-conditioning technology developed in Japan. made possible high-quality air conditioners that responds to various user needs.",
      rating: 3.0,
      numReviews: 8,
      isAdmin: false,
    },
    {
      name: 'Costway',
      brand: "Costway",
      info: "Costway believes every home is versatile ── with multi-style possibilities. We embrace reinvention with the philosophy of going beyond the furniture itself. To delight our home lovers with not only space refreshing but life blooming. Marketplace.",
      rating: 3.0,
      numReviews: 8,
      isAdmin: false,
    },
  ],
  contacts: [
    {
      fullName: "Jane Smith",
      mobilePhone: 9876543210,
      email: "jane_smith@example.com",
      country: "Canada",
      serviceType: "Air Conditioning Installation",
      equipmentAge: "1 year", // Corrected here
      subject: "Inquiry about installation",
      message: "I need a new air conditioner installed."
    },
    {
      fullName: "Jane Dow",
      mobilePhone: 9876544435,
      email: "jane-dow@example.com",
      country: "USA",
      serviceType: "Air Conditioning Service",
      equipmentAge: "3 years", // Corrected here
      subject: "Inquiry about service",
      message: "I need a new air conditioner serviced."
    }
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
      client: "John Doe",
      text: "Can we update the room layout?",
      date: "2024-08-18",
      serviceProvider: "",
      projectName: "Residential House Design"
    },
    {
      client: "ABC Corp",
      text: "Can we upgrade the office layout?",
      date: "2024-09-26",
      serviceProvider: "",
      projectName: "Office Interior Renovation"
    },
    {
      client: "Viki Crage",
      text: "Can we upgrade the construction layout?",
      date: "2024-09-25",
      serviceProvider: "",
      projectName: "Construction Design",
    },

    {
      client: "Loft&Hubs Corp",
      text: "We obtained the last transh and last milestone",
      date: "2024-09-05",
      serviceProvider: "",
      projectName: "Loft Renovation",

    },
    {
      client: "Michaella Donowan",
      text: "When can we start nogotiation regarding the first draft be ready?",
      date: "2024-09-20",
      serviceProvider: "",
      projectName: "Appartments Design"
    },

    {
      client: "Venty Corp",
      text: "When will we get the first transh for the first draft and previous milestone?",
      date: "2024-09-15",
      serviceProvider: "",
      projectName: "Ventilation System Architecting"
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
    },
    {
      title: " Everything You Should Know About Air Conditioning.",
      slug: "everything-you-should-know-about-air-conditioning",
      content: " <h2>Types of Air Conditioners.</h2><article><p>Central Air Conditioner: A central air conditioner is usually the   best choice if you have a large home or want to cool in more than one room. A central air conditioner circulates air throughout your home using a system of air ducts. </p><p> Room Air Conditioners: Room air conditioners are perfect for cooling   small spaces, like a single room or an apartment. Room air  conditioners usually sit in a window or can be mounted on a wall.</p><p> Ductless Mini-Split Air Conditioner: A ductless mini-split air conditioner is similar to a room air conditioner, but it doesn't need an air duct. Instead, a small air conditioner unit sits inside your home, and a small compressor sits outside.           </p>   <p>            Portable Air Conditioner: A portable air conditioner is an excellent  option if you need to cool a small space and you don't want to  install a window air conditioner. Portable air conditioners can be             moved from room to room, and they usually sit on the floor.</p><p>   A window air conditioner is a single unit with all of its components             enclosed inside. It ejects heat out of its outdoor side and blows             cool air into the room on the indoor side. As the name suggests, it             is installed in a window or by making a hole in the wall. Such air  conditioners have a filter that slides out so that it can be cleaned  regularly for full AC efficiency. These air conditioners have             controls on the unit & may also come with a remote.  </p>   <p>     Floor-mounted air conditioners are designed for convenience if you  prefer a mini-split but lack the required space for a wall mounted             unit. The indoor unit of floor-mounted AC rests on the floor, and             the outer unit can be installed without major site preparation or             any ductwork. This arrangement is also ideal for spaces with tilted   walls, such as attics, or building constructed with fragile             materials such as glass.           </p>   <p>            Smart air conditioners are a type of mini-split, window, or portable             air conditioner that are IoT enabled. These ACs are connected to             Wi-Fi and come with a native app providing global control through a             smartphone. Depending on the manufacturer, these air conditioners             come with numerous functionalities. Some of these include weekly             scheduling, geofencing, comfy mode, temperature range control, and             numerous other features. Utilizing these, you can achieve great             comfort coupled with energy savings.           </p>   <p>            Geothermal heating & cooling is considered a relatively new method,             it works by utilizing the insulating properties of the earth. Since             the temperatures under 4 to 6 feet of land remain consistent all             year regardless of the weather, geothermal technology takes             advantage of this to heat & cool your home more efficiently. This             system has piping that consists of a loop that circulates water             between your home, a heat pump & the ground. They require intensive             work to set up underground.           </p>   <p>            Hybrid / Dual Fuel Air Conditioner system is one that combines a gas             furnace with an electric air-source heat pump to deliver a             cost-effective & efficient performance in terms of heating &             cooling. Depending on the temperature outdoors, the system             automatically switches between burning fossil fuels and the usage of             electricity. You program the temperature at which the system             switches from heat pump to furnace, or you can make the manual             switch too.           </p>   <p>                       Evaporative coolers are sometimes categorized as air conditioning             alternatives, even though technically, they are not air conditioners             and differ in both mechanism and structure. This inclusion in the             list stems from their ability to effectively cool indoor spaces.             Unlike conventional AC systems with ducts and refrigeration cycles,             evaporative coolers operate by drawing in warm air through             water-saturated pads or media.</p></article>",
      shortDescription: "Types of Air Conditioners.",
      image: "https://accessglobal.media.clients.ellingtoncms.com/uploads/froala_editor/images/1728398396923.png",
    },
    {
      title: "How to Choose the Best Air Conditioner for Your Needs.",
      slug: "how-to-choose-the-best-ac",
      content: "<article><h2>Factors to Consider Before Buying an Air Conditioner </h2>  <p >When choosing an air conditioner, there are many factors you need to  consider making the best decision for your home. The first thing you  need to do is figure out the room's square footage or rooms you want to cool. Once you know that, you can start looking at air conditioners and their cooling capacity.  </p>  <p > The next thing you need to consider is the air conditioner's features.  Some air conditioners come with features like timers and remote  controls. These can be very helpful if you want to be able to cool  your home before you get home from work or turn off the air  conditioner when you leave for vacation. Finally, you need to think  about your budget. Air conditioners can range from a few hundred  dollars to several thousand dollars. Therefore, it's crucial to find  an air conditioner that fits your needs and budget. Installing an air  conditioner can be a great way to improve the comfort of your home. But, it's essential to do your research and choose the right air  conditioner for your home. By considering the size of the room, the  features you want, and your budget, you can find an air conditioner  that will keep you cool all summer long.   </p></article>", "shortDescription": "Factors you need to consider making the best decision.",
      image: "https://www.sandersandjohnson.com/wp-content/uploads/house_cut.png",
    },


  ]
}

export default data;