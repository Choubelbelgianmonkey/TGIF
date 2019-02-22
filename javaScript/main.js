var data;
var memberList;
var body = document.querySelector("#loader");


if (location.pathname.includes("senate")) {
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
        
       
        
        if (document.getElementById("table")){
            populateTable(memberList)};
         
        if (document.getElementById("my_checkboxes")){
            checkParty()};
        
        if (document.getElementById("drop_down_state")){
            createDropDown()}

        
        
        memberList = json.results[0].members;

            var statistic = {
                "numberOfDemocrats": calculateMember("D"),
                "numberOfRepublicans": calculateMember("R"),
                "numberOfIndependents": calculateMember("I"),

                "democratsVotingWithParty": getMemberLoyatly("D"),
                "republicansVotingWithParty": getMemberLoyatly("R"),
                "independentsVotingWithParty": getMemberLoyatly("I"),

                "10%whovoteleastoftenwiththeirpartyName": getLeastLoyalName(), // according to mentor, it is not wishable to create a string will all those value as once, better split them in one key each time
                "10%whovoteleastoftenwiththeirpartyMissedVotes": getLeastLoyalMissedVotes(),
                "10%whovoteleastoftenwiththeirpartyPercentMissedVotes": getLeastLoyalPercentMissedVotes(),

                "10%whovotemostoftenwiththeirpartyName": getMostLoyalName(),
                "10%whovotemostoftenwiththeirpartyMissedVotes": getMostLoyalMissedVotes(),
                "10%whovotemostoftenwiththeirpartyPercentMissedVotes": getMostLoyalPercentMissedVotes(),

                "10%whovoteleastoftenName": getLeastEngagedName(), 
                "10%whovoteleastoftenMissedvotes": getLeastEngagedMissedVotes(),
                "10%whovoteleastoftenName%Missedvotes": getLeastEngagedPercentMissedVotes(),

                "10%whovotemostoftenName": getMostEngagedName(),
                "10%whovotemostoftenMissedVotes": getMostEngagedMissedVotes(),
                "10%whovotemostoften%Missedvotes": getMostEngagedPercentMissedVotes(),

                "allMembers": getAllMembers(),
                "averageVoteWparty": getAverageVoteWithParty(),
            }

            var myNewViewOject = new Vue({
                el: "#app",
                data: {
                    statistic: [{
                        "numberOfDemocrats": calculateMember("D"),
                        "numberOfRepublicans": calculateMember("R"),
                        "numberOfIndependents": calculateMember("I"),

                        "democratsVotingWithParty": getMemberLoyatly("D"),
                        "republicansVotingWithParty": getMemberLoyatly("R"),
                        "independentsVotingWithParty": getMemberLoyatly("I"),

                        "10%whovoteleastoftenwiththeirpartyName": getLeastLoyalName(),
                        "10%whovoteleastoftenwiththeirpartyMissedVotes": getLeastLoyalMissedVotes(),
                        "10%whovoteleastoftenwiththeirpartyPercentMissedVotes": getLeastLoyalPercentMissedVotes(),

                        "10%whovotemostoftenwiththeirpartyName": getMostLoyalName(), 
                        "10%whovotemostoftenwiththeirpartyMissedVotes": getMostLoyalMissedVotes(),
                        "10%whovotemostoftenwiththeirpartyPercentMissedVotes": getMostLoyalPercentMissedVotes(),

                        "10%whovoteleastoftenName": getLeastEngagedName(), 
                        "10%whovoteleastoftenMissedvotes": getLeastEngagedMissedVotes(),
                        "10%whovoteleastoftenName%Missedvotes": getLeastEngagedPercentMissedVotes(),

                        "10%whovotemostoftenName": getMostEngagedName(), 
                        "10%whovotemostoftenMissedVotes": getMostEngagedMissedVotes(),
                        "10%whovotemostoften%Missedvotes": getMostEngagedPercentMissedVotes(),

                        "allMembers": getAllMembers(),
                        "averageVoteWparty": getAverageVoteWithParty(),
                    }],
                }
            });
        
        


            if (document.getElementById("not_vue")) {
                populateFirstTable(statistic)
            }


            if (document.getElementById("second_table")) { // very useful piece of code ! to remember !!!
                populateSecondTableAttendance(statistic) //  prevent a function to be triggered in all pages
            }
            if (document.getElementById("third_table")) {
                populateThirdTableAttendance(statistic)
            }
            if (document.getElementById("second_table_loyalty")) { 
                populateSecondTableLoyalty(statistic) 
            }
            if (document.getElementById("third_table_loyalty")) { 
                populateThirdTableLoyatly(statistic) 
            }
        
        var searchBar = document.getElementById("search");
        
 document.getElementById("search").addEventListener('keyup', doubleFilters);
             
       
        
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

        row.setAttribute("class", `${guy.party}, ${guy.state}`); //to add a class for each row for filter below

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var anchor = document.createElement("a");
        var class_name = cell1.setAttribute("class", "className")
        var class_party = cell2.setAttribute("class", "classParty") // to add class for the column party for the fiters below
        var class_State = cell3.setAttribute("class", "classState")

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
        }        
    }
  
    //    manual search start there
    
    var manualSearch = document.getElementById("search").value;
    var laststand2 = []
    
    
    
    if(manualSearch !== ""){
        
       for (var i = 0; i < laststand.length; i++) {
           
           var nameColumn = laststand[i].first_name + " " + laststand[i].middle_name + " " + laststand[i].last_name;
           var lowerNameColumn = nameColumn.toLowerCase();
           var lowerManualSearch = manualSearch.toLowerCase();
           
        if (lowerNameColumn.includes(lowerManualSearch)){
                    laststand2.push(laststand[i])    
            }
        }
    }     
           
    if(manualSearch !== ""){
    populateTable(laststand2)
}
    else {populateTable(laststand)}
  
}




//STATISTICS COMPUTING BEGIN HERE

function calculateMember(party) {

    var listOfMember = [] 

    for (i = 0; i < memberList.length; i++) { //looping throuhg list and dispatching each matching member to an array

        if (memberList[i].party === party) {
            listOfMember.push(memberList[i])
        }
    }
    var numberOfMember = listOfMember.length 
    

    return numberOfMember; 
  
}

function getMemberLoyatly(party) {

    var listOfMemberLoyalty = [] 

    for (i = 0; i < memberList.length; i++) {  
        if (memberList[i].party === party) { //isolating the matchingmember and pushing the proper key inside an array
            listOfMemberLoyalty.push(memberList[i].votes_with_party_pct)
        }
    }

    var sumOfLoyatly = listOfMemberLoyalty.reduce((a, b) => a + b, 0)
    // rename each member of the array a & b, where a & b are sums up, the original value is 0

    var diviseur = listOfMemberLoyalty.length === 0 ? 1 : listOfMemberLoyalty.length
    var averageOfLoyatly = sumOfLoyatly / diviseur
// the two last var have has purpose to prevent the display of NaN, as you cannot divide by 0 (JS dont allow it)

    return averageOfLoyatly.toFixed(2); 
}

// least loyal name & missed votes & % missed votes

function getLeastLoyalName() {

    var lowestTenPercent = [], 
        listOfMember = []; 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }



    return lowestTenPercent;
}

function getLeastLoyalMissedVotes() {

    var lowestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes)
    }

    lowestTenPercent.sort(function (a, b) {
        return b - a
    })
    return lowestTenPercent;

}

function getLeastLoyalPercentMissedVotes() {


    var lowestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes_pct + "%")
    }
    
      lowestTenPercent.sort(function (a, b) {
        return b - a
    })
    return lowestTenPercent;
    
}


// Most loyal name & missed votes & % missed votes

function getMostLoyalName() {

    var highestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    };

    return highestTenPercent;
}

function getMostLoyalMissedVotes() {

    var highestTenPercent = [], 
        listOfMember = [];


    for (i = 0; i < memberList.length; i++) {
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes)
    };


    highestTenPercent.sort(function (a, b) {
        return a - b
    })
    return highestTenPercent;



}

function getMostLoyalPercentMissedVotes() {

    var highestTenPercent = [], 
        listOfMember = [] 


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes_pct + "%")
    };

    return highestTenPercent;

}

// least engaged name & missed votes & % missed votes

function getLeastEngagedName() {

    var lowestTenPercent = [], 
        listOfMember = [];


    for (i = 0; i < memberList.length; i++) { 
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; 
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }


    return lowestTenPercent;
}

function getLeastEngagedMissedVotes() {

    var lowestTenPercent = [], 
        listOfMember = [];

    for (i = 0; i < memberList.length; i++) {
        listOfMember.push(memberList[i])
    };



    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; 
    });



    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        lowestTenPercent.push(listOfMember[j].missed_votes);
    }


    lowestTenPercent.sort(function (a, b) {
        return b - a
    });
    return lowestTenPercent;


}

function getLeastEngagedPercentMissedVotes() {


    var lowestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {

        lowestTenPercent.push(listOfMember[j].missed_votes_pct + "%");
    }
    return lowestTenPercent;

}


// Most engaged name & missed votes & % missed votes

function getMostEngagedName() {

    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(
            listOfMember[j].first_name +
            " " +
            (listOfMember[j].middle_name || "") +
            " " +
            listOfMember[j].last_name)
    }
    return highestTenPercent;

}

function getMostEngagedMissedVotes() {



    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes)
    }

    highestTenPercent.sort(function (a, b) {
        return b - a
    });


    return highestTenPercent;

}

function getMostEngagedPercentMissedVotes() {

    var highestTenPercent = [],  
        listOfMember = []  


    for (i = 0; i < memberList.length; i++) { //looping through list and dispatching each member to an array
        listOfMember.push(memberList[i])
    };

    listOfMember.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct; //sorting list accordingly with votes matching their party
    });

    for (j = 0; j < (listOfMember.length * 0.1); j++) {
        highestTenPercent.push(listOfMember[j].missed_votes_pct +
            "%")
    }
    return highestTenPercent;


}

function getAllMembers() {

    var allMember = memberList.length;

    return allMember;


}

function getAverageVoteWithParty() {
    //first: need to revert the toFixed(2), as it transform the numbers into string, making impossible to calculate the average

    var voteWpartyD = Number(getMemberLoyatly("D")),
        voteWpartyR = Number(getMemberLoyatly("R")),
        voteWpartyI = Number(getMemberLoyatly("I"));

    var averageVoteWParty = (voteWpartyD + voteWpartyR + voteWpartyI) / 3;

    return averageVoteWParty.toFixed(2);

}



//TABLE BEGIN HERE


function populateFirstTable(statistic) {

    var tbody1 = document.getElementById("first_row"), // DO NOT ADD THE ID IN A THEAD, use a TBODY instead
        row1 = tbody1.insertRow(-1), //minus one in ordert o create row from top to bottom
        cell1 = row1.insertCell(0),
        cell2 = row1.insertCell(1),
        cell3 = row1.insertCell(2);

    cell1.innerHTML = "Republicans";
    cell2.innerHTML = statistic.numberOfRepublicans;
    cell3.innerHTML = statistic.republicansVotingWithParty;

    var tbody2 = document.getElementById("second_row"),
        row2 = tbody2.insertRow(-1),
        cell4 = row2.insertCell(0),
        cell5 = row2.insertCell(1),
        cell6 = row2.insertCell(2);

    cell4.innerHTML = "Democrats";
    cell5.innerHTML = statistic.numberOfDemocrats;
    cell6.innerHTML = statistic.democratsVotingWithParty;

    var tbody3 = document.getElementById("third_row"),
        row3 = tbody3.insertRow(-1),
        cell7 = row3.insertCell(0),
        cell8 = row3.insertCell(1),
        cell9 = row3.insertCell(2);

    cell7.innerHTML = "Independent";
    cell8.innerHTML = statistic.numberOfIndependents;
    cell9.innerHTML = statistic.independentsVotingWithParty;

    var tbody4 = document.getElementById("fourth_row"),
        row4 = tbody4.insertRow(-1),
        cell10 = row4.insertCell(0),
        cell11 = row4.insertCell(1),
        cell12 = row4.insertCell(2);

    cell10.innerHTML = "Total";
    cell11.innerHTML = statistic.allMembers;
    cell12.innerHTML = statistic.averageVoteWparty;
}

function populateSecondTableAttendance(statistic) {



    var leastReliable = statistic["10%whovoteleastoftenName"],
        tbody = document.getElementById("second_table");

    tbody.innerHTML = ""; // to erase everything previously done (delte all tr & td added in HTML)
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenMissedvotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenName%Missedvotes"][i];

        tbody.appendChild(newRow);
    }

}

function populateThirdTableAttendance(statistic) {

    var leastReliable = statistic["10%whovoteleastoftenName"],
        tbody = document.getElementById("third_table"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoften%Missedvotes"][i];

        tbody.appendChild(newRow);
    }

}

function populateSecondTableLoyalty(statistic) {

    var leastReliable = statistic["10%whovoteleastoftenwiththeirpartyName"],
        tbody = document.getElementById("second_table_loyalty"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovoteleastoftenwiththeirpartyPercentMissedVotes"][i];

        tbody.appendChild(newRow);
    }
}

function populateThirdTableLoyatly(statistic) {

    var leastReliable = statistic["10%whovotemostoftenwiththeirpartyName"],
        tbody = document.getElementById("third_table_loyalty"); 

    tbody.innerHTML = ""; 
    for (i = 0;
        (i < leastReliable.length); i++) {
        var newRow = document.createElement("tr");

        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyName"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyMissedVotes"][i];
        newRow.insertCell().innerHTML = statistic["10%whovotemostoftenwiththeirpartyPercentMissedVotes"][i];

        tbody.appendChild(newRow);
    }
}

