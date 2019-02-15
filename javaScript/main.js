var data; //empty var wich will be filled out by a json through the function start(url) below
var memberList;


if (location.pathname == "/senate-data.html" || location.pathname == "/Senate%20Attendance%20statistics.html" || location.pathname == "/Senate%20Partyl%20Loyalty.html") {
    start("https://api.propublica.org/congress/v1/113/senate/members.json");
} else {
    start("https://api.propublica.org/congress/v1/113/house/members.json");
}

//the abovefunction allow to dynamically set up the targeted json file in the function below
// kindly note the function is called in the {}, therefore the function following the conditon is calling another function
// the content of the targeted json file will be fetch below:

function start(url) { //here begin the function calling for the json


    fetch(url, { //url as set up on lines 3 to 7
            method: "GET",
            headers: new Headers({ //adding header as per website, here the header will be the API key received earlier
                "X-API-Key": 'bKtSKxaOvma8xSiQfmAzDDFoHg9R79x6LUVFeben'
            })
        }).then(function (response) { //if 200: return json promises
            if (response.ok)
                return response.json();
        }).then(function (json) { //using a function with the json:
            // VERY IMPORTANT:
            // as main VAR is here, we can and we HAVE to call all the relevant function here (VAR dont cross {})

            memberList = json.results[0].members;
            populateTable(memberList); //the function created before in order to populate the table! NB: I used the variable memberList this time as it contain all the member of the json


            checkParty() // to create checkboxes from this json
            createDropDown() // to create the dropdown from this json
        })
        .catch(function (error) {
            console.log(error);
        })
}

//step 1 and last step: table content begin here, and filter end here as well, this is a dynamical filter!

function populateTable(guys) {
    var tbody = document.getElementById("table")

    tbody.innerHTML = ""; // reset the content of the table for each loop for the function searchParty() & searchState()

    for (i = 0; i < guys.length; i++) {

        var row = table.insertRow(-1); //minus one in ordert o create row from top to bottom
        row.setAttribute("class", ` ${guys[i].party}, ${guys[i].state}`); //to add a class for each row for filter below

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var anchor = document.createElement("a");
        var class_party = cell2.setAttribute("class", "classParty") // to add class for the column party for the fiters below
        var class_State = cell3.setAttribute("class", "classState") // to add class for the column state for the fiters below

        anchor.setAttribute("href", guys[i].url);
        anchor.textContent = guys[i].last_name + " " + guys[i].first_name + " " + (guys[i].middle_name || "");

        cell1.append(anchor);
        cell2.append(guys[i].party);
        cell3.append(guys[i].state);
        cell4.append(guys[i].seniority);
        cell5.append(guys[i].votes_with_party_pct);
    }
}

//navbar begin here
var navBar = document.querySelectorAll("div.navSelector > option");

// step 2: creating checkboxes from party
// path to requested value: data.results[0].members[i].party

var partyList = []; // this is the list of the party w/o duplicate

function checkParty() {

    //step 1 : create checkboxes
    var my_checkboxes = document.getElementById("my_checkboxes") //this function start at the ID "my_checkboxes" in                                                                                       // the HTML page
    for (var i = 0; i < memberList.length; i++) { // this loop 
        if (!partyList.includes(memberList[i].party)) { //  merge duplicate    
            partyList.push(memberList[i].party); // and create an array
        }
    }

    if (!partyList.includes("I")) {
        partyList.push("I")
    }

    partyList.sort() //i sort them now in order to have a reliable array for the filters function "doubleFilters()"

    partyList.forEach(party => { //function inside another function! funception!
        //party here is a variable wich is given to all element in the array

        var checkBox = document.createElement("input") //this function
        checkBox.type = "checkbox"; // create an input type checkbox

        var label = document.createElement("label"); // and an label   
        checkBox.value = party; // with the value of party

        checkBox.setAttribute("class", "myInput"); // and a class for the search filter afterward

        my_checkboxes.appendChild(checkBox); //then create inside the div 
        my_checkboxes.appendChild(label); // of the html page
        label.appendChild(document.createTextNode(party)); // the aforementioned variables

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
    var dropDownState = document.getElementById("drop_down_state") //this function start at the ID "dropDownState" in                                                                                       // the HTML page

    for (var i = 0; i < memberList.length; i++) { // this loop 
        if (!stateList.includes(memberList[i].state)) { //  merge duplicate    
            stateList.push(memberList[i].state); // and create an array
        }
    }


    for (var j = 0; j < stateList.length; j++) {
        var stateDrop = document.createElement("option"); //this loop create an option inside the <select> tag

        var label = document.createElement("label"); // and an label   
        stateDrop.value = stateList[j]; // with the value of state

        stateDrop.setAttribute("class", "myState"); // and an ID for the search filter afterward

        stateDrop.append(stateList[j]); // this one is NOT appendChild because there is no child tag for the text of a dropdown menu 
        dropDownState.appendChild(stateDrop); //then create inside the div 
        dropDownState.appendChild(label); // of the html page
        label.appendChild(document.createTextNode(stateList[j])); // the aforementioned variables
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