var data;
var memberList;
var body = document.querySelector("#loader");


if (location.pathname == "/senate_data.html" || location.pathname == "/Senate_Attendance_statistics.html" || location.pathname == "/Senate_Partyl_Loyalty.html") {
    start("https://api.propublica.org/congress/v1/113/senate/members.json");
} else {
    start("https://api.propublica.org/congress/v1/113/house/members.json");
}

//the abovefunction allow to dynamically set up the targeted json file in the function below. This might not work if bracket dont launch chrome properly
// kindly note the function is called in the {}, therefore the function following the conditon is calling another function
// the content of the targeted json file will be fetch below:

function start(url) { //here begin the function calling for the json


    fetch(url, { //url as set up on lines 3 to 7
            method: "GET",
            headers: new Headers({ //adding header as per website, here the header will be the API key received earlier
                "X-API-Key": 'bKtSKxaOvma8xSiQfmAzDDFoHg9R79x6LUVFeben'
            })
        })
        .then(function (response) {
            body.classList.add("loading"); //loader begin here
            if (response.ok)
                return response.json();
        }).then(function (json) {
            // VERY IMPORTANT:
            // as main VAR is here, we can and we HAVE to call all the relevant function here (VAR dont cross {})

            memberList = json.results[0].members;


            populateTable(memberList);

            checkParty()
            createDropDown()
            body.classList.remove("loading"); // remove the ajax loader  
        })
        .catch(function (error) {
            console.log(error);
        })
}

//step 1 and last step: table content begin here, and filter end here as well, this is a dynamical filter!

function populateTable(guys) {
    var tbody = document.getElementById("table");
    var disclaimer = document.getElementById("table");
    
    
    tbody.innerHTML = ""; // reset the content of the table for each loop for the function searchParty() & searchState()
    

if (guys == 0){
    var content = document.createElement("p")
   disclaimer.appendChild(content)
    content.setAttribute("class", "beautifulText");
    content.innerHTML = "No member matching this criteria. Try to change State or Party.";

}
    
    else{
        
    guys.forEach(guy => {
        var row = table.insertRow(-1); //minus one in order to create row from top to bottom

        row.setAttribute("class", ` ${guy.party}, ${guy.state}`); //to add a class for each row for filter below

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var anchor = document.createElement("a");
        var class_party = cell2.setAttribute("class", "classParty") // to add class for the column party for the fiters below
        var class_State = cell3.setAttribute("class", "classState") // to add class for the column state for the fiters below

        anchor.setAttribute("href", guy.url);
        anchor.textContent = guy.last_name + " " + guy.first_name + " " + (guy.middle_name || "");

        cell1.append(anchor);
        cell2.append(guy.party);
        cell3.append(guy.state);
        cell4.append(guy.seniority);
        cell5.append(guy.votes_with_party_pct);

    })
    }
    
}

//navbar begin here
var navBar = document.querySelectorAll("div.navSelector > option");

// step 2: creating checkboxes from party



function checkParty() {
    
    var partyList = []; // this is the list of the party w/o duplicate

    //step 1 : create checkboxes
    var my_checkboxes = document.getElementById("my_checkboxes")
    for (var i = 0; i < memberList.length; i++) { // this loop 
        if (!partyList.includes(memberList[i].party)) { //  merge duplicate    
            partyList.push(memberList[i].party); // and create an array
        }
    }

    if (!partyList.includes("I")) {
        partyList.push("I")
    }

    partyList.sort() //i sort them now in order to have a reliable array for the filters function "doubleFilters()"

    var fullPartyName = partyList.map(party => {

        if (party === "D") {
            party = "Democrat"
        } else if (party === "I") {
            party = "Independant"
        } else {
            party = "Republican"
        }
        return party // very important! the return allow the value to "leave" the {}
    })
    
    fullPartyName   .forEach(party => { //function inside another function! funception!
        //party here is a variable wich is given to all element in the array
        
        var label = document.createElement("label");
        var checkBox = document.createElement("input");
       checkBox.type = "checkbox";
        checkBox.value = party;
      
        my_checkboxes.appendChild(label)

       label.appendChild(checkBox);
  
        checkBox.setAttribute("class", "myInput");
        
        label.appendChild(document.createTextNode(party));
                                         
    })
    
    document.getElementsByClassName("myInput")[0].addEventListener("change", doubleFilters) // adding event listener to each checkbox
    document.getElementsByClassName("myInput")[1].addEventListener("change", doubleFilters)
    document.getElementsByClassName("myInput")[2].addEventListener("change", doubleFilters)
    document.getElementById("drop_down_state").addEventListener("change", doubleFilters)

}

//step 3: creating filters for party, Cf new function: doubleFilters()

var checkBoxes = document.getElementsByClassName("myInput"); //isolating checkboxes

//step 4: create state dropDown

var stateList = []

function createDropDown() {
    //step 1 : create dropDown
    var dropDownState = document.getElementById("drop_down_state");

    for (var i = 0; i < memberList.length; i++) { // this loop 
        if (!stateList.includes(memberList[i].state)) { //  merge duplicate    
            stateList.push(memberList[i].state); // and create an array
        }
    }


    var nameList = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District Of Columbia",
        "FM": "Federated States Of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "MP": "Northern Mariana Islands",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }


    for (var j = 0; j < stateList.length; j++) {
        var stateDrop = document.createElement("option");


        stateDrop.value = stateList[j];

        stateDrop.setAttribute("class", "myState");

        stateDrop.append(nameList[stateList[j]]); // this one is NOT appendChild because there is no child tag for the text of a dropdown menu 

        //HERE pay attention, the [stateList[j] is actually a matching string of letter in nameList EG: nameList[stateList[1]] means nameList.TN. Therefore its pushing the value matching the key nameList[stateList[1]]:Tenessee

        dropDownState.appendChild(stateDrop);

    }
}

//step 5 create an array wich will contain only row matching search, then pushing them to the first (and therefore last) function populateTable(guys)


function doubleFilters() {

    var selectedState = document.getElementById("drop_down_state").value
    var my_checkboxes = document.getElementById("my_table") // this function will start at the tabletag in the HTML page
    var last_stand = document.getElementById("last_stand")
    if (document.getElementsByClassName("myInput")[2]) {
        addEventListener("change", doubleFilters)
    }

    var laststand = []

    for (var i = 0; i < memberList.length; i++) { //checking the the row of json


        if (memberList[i].party === "D" && checkBoxes[0].checked && (selectedState === "" || selectedState === memberList[i].state)) {

            laststand.push(memberList[i])
        }

        // if the party field in json and the checkbox is cheked and it matches the value, push it in the array
        else if (memberList[i].party === "I" && checkBoxes[1].checked && (selectedState === "" || selectedState === memberList[i].state)) {

            laststand.push(memberList[i])

        } else if (memberList[i].party === "R" && checkBoxes[2].checked && (selectedState === "" || selectedState === memberList[i].state)) {

            laststand.push(memberList[i])

        } else if (!checkBoxes[0].checked && !checkBoxes[1].checked && !checkBoxes[2].checked && (selectedState === "" || selectedState === memberList[i].state)) {

            laststand.push(memberList[i])

        } else if (checkBoxes[0].checked && checkBoxes[1].checked && checkBoxes[2].checked && (selectedState === "" || selectedState === memberList[i].state)) {

            laststand.push(memberList[i])
            console.log(5, laststand)
        }
    }

    populateTable(laststand)

}
