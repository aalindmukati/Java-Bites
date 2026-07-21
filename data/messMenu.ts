export interface DayMenu {
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
}

export interface MessMenuData {
  [day: string]: DayMenu;
}

export const messMenu: MessMenuData = {
  Monday: {
    breakfast: [
      "Sweet",
      "Bread",
      "Butter",
      "Jam",
      "Idly",
      "Sambar",
      "Spl Chutney",
      "Poori",
      "Alco Dal Masala",
      "Tea / Coffee / Milk",
      "Boiled Egg",
      "Banana"
    ],
    lunch: [
      "Chappathi",
      "Chapp Kasa",
      "Jeera Pulao",
      "Steamed Rice",
      "Masala Sambar",
      "Bagan-Dal",
      "Mix Veg Usili",
      "Lemon Rasam",
      "Pickle",
      "Butter Milk",
      "Fryums"
    ],
    snacks: [
      "Pav Bajji",
      "Tea / Coffee"
    ],
    dinner: [
      "Punjabi Paratha",
      "Rajma Makkan Wala",
      "Dosa",
      "Idly Podi",
      "Ctl. Special Chutney",
      "Steamed Rice",
      "Vegetable Dal",
      "Rasam",
      "Pickle",
      "Fryums",
      "Veg-Salad",
      "Mutton Gravy**"
    ]
  },
  Tuesday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Ghee Pongal",
      "Vadai",
      "Veg Kosthu",
      "Coconut Chutney",
      "Poha",
      "Mint Chutney",
      "Tea / Coffee / Milk",
      "Masala Omlet"
    ],
    lunch: [
      "Sweet",
      "Poori",
      "Mattar Ghughni",
      "Variety Rice",
      "Steamed Rice",
      "Sambar",
      "Dal Lasooni",
      "Tomato Rasam",
      "Gobi-65 / Bhindi J-puri",
      "Fryums",
      "Butter Milk",
      "Pickle"
    ],
    snacks: [
      "Boiled Peanut / Black Channa Sundal",
      "Tea / Coffee"
    ],
    dinner: [
      "Chappathi",
      "Mix veg Khurma",
      "Fried Rice / Noodles",
      "Manchurian Dry / Crispy Vegetable",
      "Steamed Rice",
      "Rasam",
      "Dal Fry",
      "Pickle",
      "Fryums",
      "Veg-Salad",
      "Milk",
      "Spl Fruits",
      "**Chicken Gravy**"
    ]
  },
  Wednesday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Dosa",
      "Idly Podi",
      "Oil",
      "Arachuvitta Sambar",
      "Chutney",
      "Chappthi",
      "Alco Rajma Masala",
      "Tea/ Coffee / Milk",
      "Banana"
    ],
    lunch: [
      "Butter Roti",
      "Alco Palak",
      "Peas Pulao",
      "Dal Makhni",
      "Kadai Vegetable",
      "Steamed Rice",
      "Drumstick Brinjal Sambar",
      "Garlic Rasam",
      "Pickle",
      "Fryums",
      "Butter Milk"
    ],
    snacks: [
      "Veg Puff / Sweet Bun",
      "Tea/Coffee"
    ],
    dinner: [
      "Chappathi",
      "Steamed Rice",
      "Dal Tadka",
      "Chicken Masala (Non-Veg) / Paneer Butter Masala",
      "Rasam",
      "Pickle",
      "Fryums",
      "Veg Salad",
      "Milk",
      "**Chicken Gravy**"
    ]
  },
  Thursday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Chappathi",
      "Alco Masal",
      "Moker Kasa",
      "Veg Semiya Kichadi",
      "Coconut Chutney",
      "Boiled Egg",
      "Tea / Coffee / Milk"
    ],
    lunch: [
      "Luchi",
      "Kashmiri Dum Alco",
      "Onion Pulao",
      "Steamed Rice",
      "Mysore Dal Fry",
      "Kadi Pakoda",
      "Paper Rasam",
      "Poriyal",
      "Pickle",
      "Fryums",
      "Butter Milk"
    ],
    snacks: [
      "Pani Poori (or) Chunda Nasta",
      "Tea / Coffee"
    ],
    dinner: [
      "Ghee Pulao / Kaju Pulao (Basmati Rice)",
      "Chappathi",
      "Mutter Paneer",
      "Steamed Rice",
      "Dal Tadka",
      "Rasam",
      "Alco Peanut Masala",
      "Pickle",
      "Veg Salad",
      "Milk",
      "Ice-cream",
      "** Mutton Gravy**"
    ]
  },
  Friday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Podi Dosa",
      "Idly Podi",
      "Oil",
      "Casi Chit Sambar",
      "Chappathi",
      "Mutar Masala",
      "Tea / Coffee / Milk",
      "Boiled Egg",
      "Banana"
    ],
    lunch: [
      "Dry Jamun / Bread Halwa",
      "Veg Briyani",
      "Mix Raitha",
      "Bisebalabath",
      "Curd Rice",
      "Steamed Rice",
      "Tomato Rasam",
      "Alco Gobi Adaraki",
      "Moongdal Tadka",
      "Pickle Fryums"
    ],
    snacks: [
      "Bonda / Vada",
      "Chutney",
      "Tea / Coffee"
    ],
    dinner: [
      "Chole Bhature",
      "Steamed Rice",
      "Tomato Dal",
      "Samba Rava Upma",
      "Coconut Chutney",
      "Rasam",
      "Cabbage Poriyal",
      "Pickle",
      "Fryums.",
      "**Chicken Gravy**"
    ]
  },
  Saturday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Chappathi",
      "Veg Khurma",
      "Idiyappam",
      "Lemon or Kusalou",
      "Coconut Chutney",
      "Tea",
      "Tea / Coffee / Milk"
    ],
    lunch: [
      "Poori",
      "Dal Alco Massala",
      "Veg Pulao",
      "Steamed Rice",
      "Punjabi Dal Todka",
      "Bhindi Do Pyaza",
      "Kera Kuzhambu",
      "Kootu",
      "Jeera Rasam",
      "Pickle",
      "Special Fryums",
      "Butter Milk"
    ],
    snacks: [
      "Cake(or)Brownie",
      "Tea / Coffee"
    ],
    dinner: [
      "Sweet",
      "Malabar Paratha",
      "Meat Moker Curry",
      "Mix Vegetables Sabji",
      "Steamed Rice",
      "Dal Makhni",
      "Idly",
      "Idly Podi",
      "Oil",
      "Chutney",
      "Tomato Sambar",
      "Rasam",
      "Pickle",
      "Fryums",
      "Veg Salad",
      "Milk",
      "** Fish Gravy**"
    ]
  },
  Sunday: {
    breakfast: [
      "Bread",
      "Butter",
      "Jam",
      "Chole Poori",
      "Veg Upma",
      "Coconut Chutney",
      "Tea / Coffee / Milk"
    ],
    lunch: [
      "Chappathi",
      "Chicken (Pepper / Kadai)",
      "Panneer Butter Masala (or) Kadai Panneer",
      "Dal Dhaaka",
      "Mint Fruits Pu Pulao",
      "Steamed Rice",
      "Garlic, Rasam",
      "Poriyal",
      "Pickle",
      "Fryums",
      "Butter Milk"
    ],
    snacks: [
      "Corn / Bajji (dal Chutney",
      "Tea / Coffee"
    ],
    dinner: [
      "Variety Stuffing Paratha",
      "Curd",
      "Steamed Rice",
      "Hara Moong Dal Tadka",
      "Kathamba Sambar",
      "Poriyal",
      "Rasam",
      "Pickle",
      "Fryums",
      "Veg Salad",
      "Milk",
      "Ice-Cream",
      "**Chicken Gravy**"
    ]
  }
};
