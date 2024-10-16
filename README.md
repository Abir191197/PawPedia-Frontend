# PawPedia

## Project Overview
"PawPedia" offers a valuable mix of practical advice and engaging tales for pet owners. It covers essential care aspects such as proper nutrition, exercise, grooming, and regular veterinary hospital visits to ensure pets stay healthy and happy. Additionally, it includes heartwarming stories of love and loyalty between pets and their owners, as well as inspiring adoption and rescue tales. Together, these tips and stories provide both guidance on maintaining pet well-being and emotional moments that highlight the deep bond between humans and their pets.

## Tech Stack

### Client

![NextJs](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=NextJs&logoColor=%2361DAFB)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Server

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![mongoose](https://img.shields.io/badge/Mongoose-563D7C?style=for-the-badge&logo=mongoose&logoColor=white)

## Backend Repository

- [Cox's SeaSide Bike Backend](https://github.com/Abir191197/PawPedia-Backend)


## Project Objectives
- Develop a fully functional web application with both frontend and backend components.
- Implement secure user authentication and authorization using JWT.
- Design and integrate a non-relational database (MongoDB) for efficient data storage and retrieval.
- Create a responsive user interface that adapts to various screen sizes and devices.
- Implement a rich text editor for content creation, allowing users to share detailed travel tips and guides.
- Integrate a payment gateway (AAMARPAY ) for premium content access, enabling users to subscribe to exclusive features.
- Implement advanced search functionality with filtering options for users to easily find relevant pet care tips or story content.
- Enable social interactions such as upvoting, commenting, and following other users.



### User Authentication:
- **Registration**: Users can sign up using their email, password, and other relevant details.
- **Secure Login/Logout**: JWT-based authentication ensures a secure login and logout process.


### User Profile Management:
- **Profile Updates**: Users can update personal information, including profile pictures.
- **My Profile Section**: Displays user posts, followers, and following, along with other relevant details.
  > **Design Inspiration**: Consider a layout similar to Facebook's profile page or the profile design style of X (formerly Twitter).

### Pet Stories Creation & Sharing:
- **Content Creation**: Users can write and edit pet care tips and stories using a rich text editor or Markdown, providing flexibility and ease of use for formatting. Users can delete their own content.
- **Image Attachments**: Authors can attach images to their posts, making the content more engaging and visually appealing.
- **Content Categorization**: Posts are categorized for better organization and discovery. Content can be classified as either a "Tip" or a "Story," allowing users to easily browse based on their interest.
- **Monetization**: Authors (the user who wrote the post) have the option to create premium content, enabling them to monetize their stories and tips by offering exclusive insights or advice. You don't need to worry about the author's payment :D just make sure the site is making money by implementing the payment feature.

### Upvote & Downvote System:
- Users can upvote or downvote both posts.
- Sorting options available to display the most upvoted content for easier discovery.

### Commenting System:
- Users can comment on posts, with the ability to edit or delete their own comments.
- Replying to other users' comments is optional.

### Payment Integration:
- Integration with Aamarpay or Stripe enables secure payments for premium features, such as access to exclusive content.
- Certain premium content will only be unlocked after making a specified payment.

### News Feed:
- **Post Creation**: A user-friendly post creation option at the top of the page for quick and easy sharing.
- **Dynamic Content**: A real-time news feed showcasing the latest pet care tips and stories.
- **Infinite Scroll**: Seamlessly load more content as users scroll down the page.
- **Search & Filter**: Advanced search and filtering options allow users to explore content based on keywords or categories.
  - When searching or filtering, the content will be sorted by upvote count for the most relevant results.
- **Premium Content**: Premium posts are highlighted with a special badge. Users can view a preview, but the full content is accessible only after completing a payment.

### Following System:
- **User Following**: Users can follow/unfollow other pet owners and view content from those they follow.

### Micro Animations:
- Smooth transitions, hover effects, and loading animations to enhance the user experience.

## User Interface Design

- **Login/Registration Page**: Forms for user sign-up and login with secure authentication.
- **User Dashboard**: A personalized dashboard displaying user-specific content, and followed users and followers.
- **Admin Dashboard**:
  - A control panel for administrators to manage:
    - Content
    - Users
    - Payment history
  - Admins can publish or unpublish posts directly from the dashboard.
- **Profile Page**: A section for users and admins to view and edit their profiles, including a display of their posts, followers, and followed users.
- **News-feed**: A page listing all travel posts, with filtering options by category and other relevant properties.
- **About Us Page**: Information about the team or organization behind the project, outlining the mission and vision.
- **Contact Us Page**: A contact form or details for user inquiries and support.



- **PDF Generation**: Users can generate PDFs outlining nutrition needs based on a pet’s age and weight. This feature will be accessible via a calculator-like tool in the user dashboard, primarily for common pets. The generated chart will resemble the example here.
- **Debouncing Mechanism**: A debouncing feature is implemented to optimize the search experience, reducing unnecessary searches and improving performance.

## Support

For support, email ardhrubo908@gmail.com

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)

[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
