//! REQUIRES Item.js

/** @type {Item[]} } */
const items = {};
/** list of selected item IDs for filtering/deleting
 * @type {string[]} } */
let selected = [];

// Concrete properties of items
const ItemProps = {
  fruit: new ItemProp(1, "success", "fa-solid fa-apple-whole"),
  legume: new ItemProp(2, "warning", "fa-solid fa-carrot"),
};

const elements = {
  addBox: {
    input_itemName: $("#input_itemName"),
    radio_fruits: $("#radio_fruits"),
    radio_legumes: $("#radio_legumes"),
    button_addSpecific: $("#button_AddSpecific"),
    button_addGeneral: $("#button_AddGeneral"),
  },
  filterBox: {
    search: $("#button_Search"),
    deleteButton: $("#button_Delete"),
    search: $("#input_search"),
  },
  lists: {
    general: $("#listGeneral"),
    fruits: $("#listFruits"),
    legumes: $("#listLegumes"),
  },
};

const getItemType = () => {
  if (elements.addBox.radio_fruits.is(":checked")) return ItemProps.fruit.type;
  if (elements.addBox.radio_legumes.is(":checked")) return ItemProps.legume.type;
  return -1;
};

const addItem = (item) => {
  items[item.id] = item;
  elements.addBox.input_itemName.val("");

  const element = item.generateElement();
  if (item.isGeneralList) {
    element.addEventListener("click", () => moveItemToOwnList(item.id));
    elements.lists.general.append(element);
  } else if (item.type === ItemProps.fruit.type) listLegumes.append(element);
  else if (item.type === ItemProps.legume.type) listFruits.append(element);
  else {
    console.error("Unknown item type");
    return alert("Unknown item type: " + type);
  }
};

const addItem_auto = (isGeneralList = false) => {
  const type = getItemType();
  if (type < 0) return alert("Please select an item type");
  const name = elements.addBox.input_itemName.val().trim();
  if (!name.length) return alert("Please enter an item name");

  addItem(new Item(name, type, isGeneralList));
};

const resetSelection = () => {
  for (item of Object.values(items)) {
    document
      .getElementById(item.id) //
      .classList.remove("selected");
  }
  selected = [];
};

/** @return {string[]} filtered list of item IDs (`selected` array) */
const updateSelected = () => {
  resetSelection();
  const query = elements.filterBox.search.val().trim();
  if (!query.length) return selected;
  for (item of Object.values(items)) {
    // jq didnt work, using the exact same id, fallback to vanilla
    const element = document.getElementById(item.id);
    if (!item.name.includes(query)) {
      element.classList.remove("selected");
      continue;
    }
    selected.push(item.id);
    element.classList.add("selected");
  }
  return selected;
};

const del = () => {
  if (!selected.length) return alert("Please search to select items to delete");
  for (id of selected) {
    document.getElementById(id).remove();
    delete items[id];
  }
  selected = [];
};

const moveItemToOwnList = (id) => {
  if (!items.hasOwnProperty(id)) {
    const msg = `Unknown item ID: ${id}`;
    console.error(msg);
    return alert(msg);
  }
  const item = items[id];
  const element = document.getElementById(id);
  if (
    !item.isGeneralList || //
    !element ||
    element.parentNode.id !== "listGeneral"
  ) {
    const msg = `Invalid item to be moved: ${id}`;
    console.error(msg);
    return alert(msg);
  }

  element.remove();
  item.isGeneralList = false;
  addItem(item);
};

elements.addBox.button_addGeneral.on("click", () => addItem_auto(true));
elements.addBox.button_addSpecific.on("click", () => addItem_auto());

elements.filterBox.search.on("input", () => updateSelected());
elements.filterBox.deleteButton.on("click", () => del());
