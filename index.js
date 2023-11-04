const contacts = require("./contacts");

const { Command } = require("commander");
const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const list = await actionHandler(contacts.listContacts);
      console.table(list);
      break;

    case "get":
      const requestedContact = await actionHandler(contacts.getContactById, id);
      console.log(requestedContact);
      break;

    case "add":
      const newContact = await actionHandler(
        contacts.addContact,
        name,
        email,
        phone
      );
      console.log("Added a record: ", newContact);
      break;

    case "remove":
      const removedContact = await actionHandler(contacts.removeContact, id);
      console.log("Deleted record: ", removedContact);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

async function actionHandler(actionCallback, ...args) {
  try {
    return args ? await actionCallback(...args) : await actionCallback();
  } catch (error) {
    console.log("Failed action with error: ", error.message);
  }
}

invokeAction(argv);
