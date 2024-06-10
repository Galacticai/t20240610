class ItemProp {
  constructor(type, color, icon) {
    this.type = type;
    this.color = color;
    this.icon = icon;
  }
}
class Item {
  /** @type {string} */
  id;
  /** @type {string} */
  name;
  /** @type {number} */
  type;
  /** @type {boolean} */
  isGeneralList;

  constructor(name, type, isGeneralList) {
    this.id = `${Date.now()}_${Math.random()}`;
    this.name = name;
    this.type = type;
    this.isGeneralList = isGeneralList;
  }

  //   get element() {
  //     const jqElement = $(this.id);
  //     if (!jqElement.length) return null;
  //     return jqElement[0];
  //   }

  /** @return {string} the bootstrap alert color ("primary" | "success" | "warning" | "secondary") */
  #color() {
    if (this.isGeneralList) return "primary";
    if (this.type === ItemProps.fruit.type) return "success";
    if (this.type === ItemProps.legume.type) return "warning";
    return "secondary";
  }

  /** @return {HTMLElement} bootstrap alert container for this item */
  generateElement() {
    const container = $("<div>")
      .attr("id", this.id) //
      .attr("class", `alert alert-${this.#color()}`)
      .attr("role", "alert");
    container.text(this.name);
    return container[0];
  }
}
