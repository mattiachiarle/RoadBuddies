# RoadBuddies

## Developers

**Mattia Chiarle** (mchiar2@uic.edu)

**Francesca Fusco** (ffusco2@uic.edu)

**Alessandro Martinolli** (amart409@uic.edu)

Live version of the website: https://roadbuddies.onrender.com/

To use the website, you can use the following credentials:

email: test@uic.edu
password: password

Trip 1 already contains some data, while Trip 2 is clean.

There are also other users (test2@uic.edu, test3@uic.edu, test4@uic.edu, test5@uic.edu), that use the same password.

## **Architecture**

### **[Excalidraw Schema](https://excalidraw.com/#room=f10af5de26ece127e176,UnIVdGmzzvY2r0Riw1S62Q)**

### **Components:**

- **Browser**: This acts as the client interface, sending requests to either our server or third-party services via APIs. It's essentially where the frontend is executed.
- **Server**: Our central hub, housing the backend operations. It liaises with databases and offers services and content to the clients.
- **chat.db**: A dedicated server for storing chat histories.
- **packingList.db**: This database houses lists of necessary travel items along with their status, specifying whether or not someone has attended to them.
- **groups.db**: Manages records pertaining to group participants.
- **External Services**: We're integrating several external platforms for enhanced functionality:
  - **chatGPT**: To analyze packing lists, suggesting any missing items, and aid in financial decisions among group members.
  - **Spotify**: For shared playlist creation.
  - **\*\***Google Calendar:**\*\*** For common itineraries
  - **PayPal**: Though still under consideration, it's for money exchange between participants.
  - **Splitwise**: Also being evaluated, its primary use would be to monitor shared expenses.

## **External APIs**

- **chatGPT**:
  - Offer suggestions on missing items from packing lists.
  - Help determine who's responsible for the next payment.
- **Spotify**:
  - Facilitate the creation of shared playlists.
- **\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***Google Calendar:**\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***
  - Share itineraries
- **PayPal** (Potential inclusion):
  - Enable monetary exchanges between members.
- **Splitwise** (Potential inclusion):
  - Monitor and log shared group expenses.

<aside>
💡 We might eventually decide not to use Splitwise APIs in case we  simulate its functions by using ChatGPT APIs along with some algorithm of our choice in order to decide who has to pay next based on a history of previous payments (e.g. ***********************credit card roulette*********************** as suggested by the professor).

</aside>

## Hosting

In order to host the application's front-end and back-end we are going to use Render while for the database we are going Supabase.

## Minimum Viable Project

Our project consists in an agumented Group DefaultLayout Application.

**Base setup of the application**

- The user will be able to Sign up and Sign in into the application.
- The user will be able to create a new DefaultLayout, adding the starting point, the destination, the dates and the partecipants (you can add the participants from the "Edit participants" page).

**DefaultLayout manager**

- The user will be able to add or remove partecipants to/from the trip.
- The user will be able to create a list of the items that are neeeded for the trip.
- The system will keep track of which items each person is bringing and which items are not being brought by individuals.
- The user will be able to communicate with the other members through a group chat.
- The system will store the chat history
- The user will be able to insert the expences he has made during the trip.

**Expense management**

- The most important step of the MVP will be the implementation and integration of the technology of ChatGPT 3.5, thanks to that the user is going to be able to know if any item is missing and which of the participants has to pay for the next expence.

## Technologies used

### Frontend

We think that our project idea can be implemented with a single-page application. The most suitable frontend technology to create it is Vite. For the framework, we decided to use React. Lastly, we'll use Typescript.

### Backend

For the backend, we'll use the Express framework. As DB, we'll use Postgres.
