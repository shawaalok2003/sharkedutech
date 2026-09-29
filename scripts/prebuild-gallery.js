const fs = require('fs');
const path = require('path');

const metadataMap = {
    // Ahmedabad
    "01. Four Point Sheraton": {
        hotel: "Four Point Sheraton",
        person: "Ms. Mehgarani Padhi",
        designation: "Human Resource Associate"
    },
    "02. Hyatt Regency": {
        hotel: "Hyatt Regency",
        person: "Mr. Gurneet Singh, Mr. Vishal Kumar Yadav, Mr. R Jagannathan",
        designation: "Director Food & Director, Executive Chef, HRD"
    },
    "03. ITC Gardenia": {
        hotel: "ITC Gardenia",
        person: "Mr. Akshay Kavra, Mr. Dhananjay Kulkarni",
        designation: "General Manager, Head Human Resources"
    },
    "04. Renaissance Hotel Ahmedabad": {
        hotel: "Renaissance Hotel Ahmedabad",
        person: "Mr. Rohit Bajpai",
        designation: "Multi Property General Manager"
    },
    "05. Radisson Resort & Spa Kandla": {
        hotel: "Radisson Resort & Spa Kandla",
        person: "Mr. Naveen Dogra",
        designation: "General Manager"
    },

    // Bangalore
    "01. Citrus Classic Hotel": {
        hotel: "Citrus Classic Hotel",
        person: "Mr. Anish Kumar Rana",
        designation: "General Manager"
    },
    "02. Courtyard & Fairfield by Marriott": {
        hotel: "Courtyard & Fairfield by Marriott Bangalore Outer Ring Road & Rajajinagar",
        person: "Mr. Suveer Sodhi, Mr. Paul Kingsly Samraj",
        designation: "Cluster General Manager, Human Resource Manager"
    },
    "03. Fairfield by Marriott Whitefield": {
        hotel: "Fairfield by Marriott Whitefield",
        person: "Ms. Sukanya Dutta, Mr. Dip Biswas",
        designation: "Assistant Human Resource Manager, Assistant Manager L&D"
    },
    "04. Holiday Inn Bangalore Racecourse": {
        hotel: "Holiday Inn Bangalore Racecourse",
        person: "Ms. Shivani Sharma, Mr. Ganesh B",
        designation: "L&D Manager, Human Resource Manager"
    },
    "05. Keys Select by Lemon Tree Hotel Singasandra": {
        hotel: "Keys Select by Lemon Tree Hotel Singasandra",
        person: "Mr. Naveen Kumar, Mr. Santosh",
        designation: "General Manager, Human Resource"
    },
    "06. Keys Select by Lemon Tree Hotels Whitefield": {
        hotel: "Keys Select by Lemon Tree Hotels Whitefield",
        person: "Mr. Parameshwaran M, Mr. Aditya J",
        designation: "General Manager, Human Resource Executive"
    },
    "07. Lemon Tree Hotel Electronic City": {
        hotel: "Lemon Tree Hotel Electronic City",
        person: "Mr. Kumar Saurabh, Mr. Vinod Kumar",
        designation: "General Manager, Deputy Human Resource Manager"
    },
    "08. Lemon Tree Hotel Whitefield": {
        hotel: "Lemon Tree Hotel Whitefield",
        person: "Mr. John Ravi Kiran",
        designation: "General Manager"
    },
    "09. Palm Meadows Resort": {
        hotel: "Palm Meadows Resort",
        person: "Mr. Sudeep Shetty, Mr. Manohar P B",
        designation: "Head of Sales & Marketing, Human Resource Manager"
    },
    "10. Pride Hotel": {
        hotel: "Pride Hotel",
        person: "Mr. Sujit Kumar Singh, Mr. Sourabh Dey",
        designation: "Area General Manager, Assistant L&D Manager"
    },
    "11. Radisson Individual Narasapura": {
        hotel: "Radisson Individual Narasapura",
        person: "Mr. Suresh Kumar, Mr. Rajesh Sonawane",
        designation: "Assistant General Manager, Assistant Director HR"
    },

    // Chennai
    "01. Apollo Olive Plus Chennai": {
        hotel: "Apollo Olive Plus Chennai",
        person: "Mr. Murugesan A, Mr. Raghubaran Chellappa S",
        designation: "DGM HR Optal, Senior Executive HR Optal"
    },
    "02. Fairfield By Marriott Sriperumbudur": {
        hotel: "Fairfield By Marriott Sriperumbudur",
        person: "Mr. Satish G",
        designation: "Human Resource Manager"
    },
    "03. Four Points By Sheraton": {
        hotel: "Four Points By Sheraton",
        person: "Mr. Thampuran S, Mr. Sujith Chandrasekharan",
        designation: "Human Resource Manager, General Manager"
    },
    "04. Hilton Chennai": {
        hotel: "Hilton Chennai",
        person: "Mr. Vinod Ramamurthy",
        designation: "General Manager"
    },
    "05. Holiday Inn Chennai": {
        hotel: "Holiday Inn Chennai",
        person: "Mr. Divakar Shukla, Mr. Gouse Shaik",
        designation: "General Manager, Director of Human Resource"
    },

    // Goa
    "01. Fairfield by Marriott": {
        hotel: "Fairfield by Marriott",
        person: "Mr. Utkarsh Gupta",
        designation: "Front Desk Manager"
    },
    "02. St. Regis Goa": {
        hotel: "St. Regis Goa",
        person: "Mr. Jagdeep Shetty, Ms. Muskan Sonkar",
        designation: "Director Human Resources, Assistant Manager Learning & Development"
    },
    "03. JW Marriott Goa": {
        hotel: "JW Marriott Goa",
        person: "Ms. Ruby Khan, Mr. Priyabrata Dash",
        designation: "Director Human Resources, Training Manager"
    },
    "04. Lemon Tree Candolim Goa": {
        hotel: "Lemon Tree Candolim Goa",
        person: "Mr. Hansel Raju Lazer, Mr. Ruben D Souza",
        designation: "General Manager, Human Resource Supervisor"
    },
    "05. Radisson Goa": {
        hotel: "Radisson Goa",
        person: "Ms. Krittika Khapne",
        designation: "Director of Human Resources"
    },

    // Indore
    "01. Fairfield By Marriott": {
        hotel: "Fairfield By Marriott",
        person: "Ms. Aishwarya Sharma, Ms. Muskan Dixit",
        designation: "Assistant Human Resource Manager, Human Resource Executive"
    },
    "02. Indore Marriott Hotel": {
        hotel: "Indore Marriott Hotel",
        person: "Mr. Jaheer Abbas",
        designation: "Assistant Director Human Resources"
    },
    "03. Lemon Tree Indore": {
        hotel: "Lemon Tree Indore",
        person: "Mr. Rahul Yeshwant Kokare",
        designation: "Regional Manager & General Manager"
    },
    "04. Radisson Indore": {
        hotel: "Radisson Indore",
        person: "Mr. Jeetendra Nimbalkar",
        designation: "Human Resource Manager"
    },
    "05. Sheraton Indore": {
        hotel: "Sheraton Indore",
        person: "Mr. Utkarsh Pandit",
        designation: "Learning & Development Manager"
    },

    // Delhi
    "01. Bel La Monde": {
        hotel: "Bel La Monde",
        person: "Mr. Puneet Sharma",
        designation: "Vice President"
    },
    "02. Cygnet Hotel & Resort": {
        hotel: "Cygnet Hotel & Resort",
        person: "Mr. Anant Chouhan, Mr. Sachin Gaur",
        designation: "Corporate HR, Assistant Director Learning & Development"
    },
    "03. Radisson Blu Plaza": {
        hotel: "Radisson Blu Plaza",
        person: "Mr. Shashank Goyel",
        designation: "Food & Beverage Manager"
    },
    "04. Svelte Delhi": {
        hotel: "Svelte Delhi",
        person: "Ms. Manisha Bajpai, Mr. Komil Vyas",
        designation: "General Manager, Assistant Human Resources Manager"
    },
    "05. The Tivoli New Delhi": {
        hotel: "The Tivoli New Delhi",
        person: "Mr. Sanjay Kasal, Mr. Neeraj Kumar",
        designation: "Corporate General Manager, Assistant Human Resource Manager"
    },

    // Kochi
    "01. Courtyard By Marriott": {
        hotel: "Courtyard By Marriott",
        person: "Mr. Narayan Tharoor",
        designation: "Cluster General Manager"
    },
    "02. Gokulam Grand Trivandrum": {
        hotel: "Gokulam Grand Trivandrum",
        person: "Mr. S Gopimohan, Mr. R Jain",
        designation: "General Manager, HR Manager"
    },
    "03. Holiday Inn Kochi": {
        hotel: "Holiday Inn Kochi",
        person: "Mr. Suganthi Vipin",
        designation: "Director of Human Resources"
    },
    "04. Keys Select By Lemon Tree": {
        hotel: "Keys Select By Lemon Tree",
        person: "Mr. Kiron A. Aiyenkulam",
        designation: "General Manager"
    },
    "05. Keys Select": {
        hotel: "Keys Select",
        person: "Mr. Ajith G. Warrier",
        designation: "General Manager"
    }
};

function getAllImages(dir, baseDir) {
    if (!fs.existsSync(dir)) return [];
    
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            if (file !== '__MACOSX' && file !== '.DS_Store') {
                results = results.concat(getAllImages(filePath, baseDir));
            }
        } else {
            if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
                const relativePath = path.relative(baseDir, filePath);
                results.push('/' + relativePath.replace(/\\/g, '/'));
            }
        }
    });
    results.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return results;
}

const publicDir = path.join(process.cwd(), 'public');
const cityFolders = ['Ahmedabad', 'Bangalore', 'Chennai', 'Goa', 'Indore', 'Kochi', 'delhi'];

const galleryData = cityFolders.map(city => {
    const cityPath = path.join(publicDir, city);
    if (fs.existsSync(cityPath)) {
        const images = getAllImages(cityPath, publicDir);
        const items = images.map(src => {
            const filename = path.basename(src);
            for (const [key, meta] of Object.entries(metadataMap)) {
                if (filename.includes(key)) {
                    return {
                        src,
                        hotel: meta.hotel,
                        person: meta.person,
                        designation: meta.designation
                    };
                }
            }
            const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
            const clean = nameWithoutExt.replace(/^\d+[\.\s\-]+/, '');
            const parts = clean.split(' - ');
            return {
                src,
                hotel: parts[0] || clean,
                person: parts[1] || "",
                designation: parts[2] || ""
            };
        });

        return {
            city: city.charAt(0).toUpperCase() + city.slice(1),
            images: images,
            items: items
        };
    }
    return { city, images: [], items: [] };
}).filter(item => item.images.length > 0);

const outputPath = path.join(process.cwd(), 'src/app/gallery/galleryData.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(galleryData, null, 2), 'utf-8');
console.log('✅ Generated galleryData.json with rich nomenclature.');
