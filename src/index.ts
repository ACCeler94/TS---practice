const inquirer = require('inquirer');
const consola = require('consola')

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

enum Variants {
  Success = "success",
  Error = "error",
  Info = "info"
}

type InquirerAnswers = {
  action: Action
}

type User = {
  name: string,
  age: number
}

class Message  {
  constructor(private content: string){
    this.content = content
  }

  public show():void{
    console.log(this.content)
  }

  public capitalize():void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase()
  }

  public toUpperCase():void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase():void {
    this.content = this.content.toLowerCase();
  }

  static showColorized(variant: Variants, text: string){
    if(variant === "success") consola.success(text)
    if(variant === "error") consola.error(text)
    if(variant === "info") consola.info(text)
  }
}

class UsersData {
  data: User[] = []

  showAll(){
    Message.showColorized(Variants.Info, "User data")
    if(this.data.length === 0) console.log("No data...")
    else console.table(this.data)
  }

  public add(user: User){
    if(typeof user.age === 'number' && typeof user.name === 'string' && user.age > 0 && user.name.length > 0){
      this.data.push(user);
      Message.showColorized(Variants.Success, "User has been successfully added!")
    } else {
      Message.showColorized(Variants.Error, "Wrong data!")
    }
  }

  public remove(userName: string){
    const index = this.data.findIndex(user => user.name === userName);
    if(index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(Variants.Success, "User deleted!")
    } else Message.showColorized(Variants.Error, "No user found!")
  }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Variants.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");


const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(Variants.Info, "Bye bye!");
        return;

      default:
          Message.showColorized(Variants.Error, "Unknown command, try again...")
    }


    startApp();
  });
}

startApp();