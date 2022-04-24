const { v4 } = require("uuid");

const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");
const getAll = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    throw error;
  }
};

async function listContacts() {
  try {
    const contacts = await getAll();
    const list = contacts.map(({ name, phone, email }) => {
      return {
        name,
        phone,
        email,
      };
    });
    console.table(list);
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getAll();
    const selectContact = contacts.find(({ id }) => id == contactId);
    if (!selectContact) {
      throw new Error(`Contact with id=${contactId} not found`);
    }
    return console.table(selectContact);
  } catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getAll();
    const idx = contacts.findIndex(({ id }) => id == contactId);
    if (idx === -1) {
      throw new Error(`Contact with id=${contactId} not found`);
    }
    const newContacts = contacts.filter(({ id }) => id != contactId);
    const updateContacts = await JSON.stringify(newContacts);
    await fs.writeFile(contactsPath, updateContacts);
    console.table(newContacts);
  } catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };
    const contacts = await getAll();
    contacts.push(newContact);
    const updateContacts = await JSON.stringify(contacts);
    await fs.writeFile(contactsPath, updateContacts);
    console.table(contacts);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
