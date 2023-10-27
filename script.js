/////////////////////////////////////////////////
// fetch data
/////////////////////////////////////////////////

async function GetData()
{
  return await fetch("./data/bagdex.json")
  .then((response) => { return response.json() });
}


/////////////////////////////////////////////////
// global variables
/////////////////////////////////////////////////
const middle_container = document.querySelector("div.middle-container");
var selected_space = null;


/////////////////////////////////////////////////
// TEMPLATES
/////////////////////////////////////////////////
const bag_space = document.querySelector("#bag-space-template")
  .content
  .querySelector(".bag-space");

const bag_overview = document.querySelector("#bag-overview-template")
  .content
  .querySelector(".bag-overview");

const bag_item = document.querySelector("#bag-item-template")
  .content
  .querySelector(".bag-item");

function ImageExists(image_url)
{
  var http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}

function DownloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function FillBagSpaces()
{
  var bagmon_list = document.querySelector(".bagmon-list");
  bagmon_list.replaceChildren();
  
  for(let i = 0; i < 6; i++)
  {
    bagmon_list.appendChild(bag_space.cloneNode(true));
  }
}

async function FillMiddleContainer()
{
  var middle_bag_list = middle_container.querySelector(".middle-bag-list");

  data = await GetData();

  for(let i = 1; i <= 154; i++)
  {
    var current_item = bag_item.cloneNode(true);
    current_item.querySelector(".number").innerHTML = "#";

    for(let j = 0; j < (3 - String(i+1).length); j++)
      current_item.querySelector(".number").innerHTML += "0";

    current_item.querySelector(".number").innerHTML += i;

    current_item.querySelector(".image").src = "images/new_bagmons/" + i + ".webp";

    if(!ImageExists("images/new_bagmons/" + i + ".webp"))
      current_item.querySelector(".image").src = "images/bagmons/" + i + ".png";


    current_item.querySelector(".name").innerHTML = data[i]['name']; // Name
    current_item.querySelectorAll(".types > img")[0].src = "images/types/bagdex/" + data[i]["types"][1] + ".webp"; // Type 1
    current_item.querySelectorAll(".types > img")[1].src = "images/types/bagdex/" + data[i]["types"][2] + ".webp"; // Type 2
    
    if (data[i]["types"][2] == "nenhum")
    {
      current_item.querySelector(".types").removeChild(current_item.querySelectorAll(".types > img")[1]);
    }

    middle_bag_list.appendChild(current_item);
  }
}

function SelectBagSpace(event)
{
  target_element = event.currentTarget;
  var element_class = target_element.className.split(" ")[0];
  
  if (event.target.className == "close")
  {
    target_element.replaceWith(bag_space.cloneNode(true));
    
    if(target_element == selected_space)
    {
      middle_container.className = "middle-container closed";
      selected_space.className = element_class;
      selected_space = null;
      return;
    }
    
    return;
  }
  
  
  if (target_element == selected_space)
  {
    middle_container.className = "middle-container closed";
    selected_space.className = element_class;
    selected_space = null;
    return;
  }
  
  if (selected_space != null)
  selected_space.className = selected_space.className.split(" ")[0];

  selected_space = target_element;
  selected_space.className = element_class + " selected";
  
  middle_container.className = "middle-container";
}

function FillSelected(event)
{
  if (selected_space == null) return;

  var bagmon_clicked = event.currentTarget;

  var clicked_image = bagmon_clicked.querySelector(".image").src;
  var clicked_name = bagmon_clicked.querySelector(".name").innerHTML;
  var clicked_number = bagmon_clicked.querySelector(".number").innerHTML;
  var clicked_type_1 = bagmon_clicked.querySelectorAll(".types > img")[0].src;
  var clicked_type_2;

  if (bagmon_clicked.querySelectorAll(".types > img")[1] != null)
    clicked_type_2 = bagmon_clicked.querySelectorAll(".types > img")[1].src;
  else
    clicked_type_2 = "images/types/bagdex/nenhum.webp";

  var new_overview = bag_overview.cloneNode(true);

  selected_space.replaceWith(new_overview);
  selected_space = new_overview;

  selected_space.querySelector(".image").src = clicked_image;
  selected_space.querySelector(".name").innerHTML = clicked_name;
  selected_space.querySelector(".number > div").innerHTML = clicked_number;
  selected_space.querySelectorAll(".types")[0].src = clicked_type_1;
  selected_space.querySelectorAll(".types")[1].src = clicked_type_2;

  selected_space = null;
  middle_container.className = "middle-container closed";
}

FillBagSpaces();
FillMiddleContainer();


function AddNewBagmon(bagmons, new_bagmon, place)
{
  var new_object = {};
  
  for (const key in bagmons)
  {
    if (key < place)
      new_object[key] = bagmons[key];
    else
      new_object[parseInt(key) + 1] = bagmons[key];
  }

  new_object[place] = new_bagmon;

  return new_object;
}

function MakeBagmon(name, name_lower, types, attributes)
{
  return {
    "name" : name,
    "types" : { 1: types[0], 2: types[1]},
    "attributes" : {
      "atk": 20,
      "atke": 25,
      "def": 20,
      "defe": 30,
      "hp": 50,
      "spd": 30
    },
    "name_lower" : name_lower
  }
}

async function ChangeData()
{
  var data = await GetData();

  var new_data = {};

  new_bagmons = [
    MakeBagmon("Magato", "magato", ["voltaico", "nenhum"], [-1, -1, -1, -1, -1, -1]),
    MakeBagmon("Magaiato", "magaiato", ["voltaico", "nenhum"], [-1, -1, -1, -1, -1, -1]),
    MakeBagmon("Amatirica", "amatirica", ["voltaico", "noturno"], [-1, -1, -1, -1, -1, -1]),
  ];

  for (let i = 0; i < new_bagmons.length; i++)
  {
    data = AddNewBagmon(data, new_bagmons[i], i+13);
  }
}