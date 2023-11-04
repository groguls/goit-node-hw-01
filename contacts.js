const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

class Contacts {
  constructor(path) {
    this.path = path;
  }

  listContacts = async () => {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  };

  getContactById = async (contactId) => {
    const contacts = await this.listContacts();
    const requestedContact = contacts.find(
      (contact) => contact.id === contactId
    );
    return requestedContact ? requestedContact : null;
  };

  removeContact = async (contactId) => {
    const contacts = await this.listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.log("Contact not found");
      return null;
    }
    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  };

  addContact = async (name, email, phone) => {
    const contacts = await this.listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  };
}

module.exports = new Contacts(contactsPath);
