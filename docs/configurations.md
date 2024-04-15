# Pre Configurations  

> 🚧 Do note that this project is still on development, it **might** have impact changes, including this configurations method.  

!> Because it still on development, and I need to record the changes to version control, and the environment data will be recorded too. Though, you may provide some feedback / suggestion for this, I may be appreciate that 💖.

#### ! UPDATE !
I have installed `dotenv` library to store several sensitive variables like tokens, or email in `.env` file. Currently, I do not record the `.env` variables naming at GitHub. Maybe soon, I'll find a way to create an interface for that, so you will know what variables are used for the app.

As of current version, I put some global configurations needed for the project on a Typescript file in : `./src/env.ts`.  
You can do several things like changing Bot name, short name, or codename (used for watermarking sticker author, etc.)
