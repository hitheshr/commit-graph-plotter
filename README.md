# Commit Graph Plotter

Commit Graph Plotter is a client-side web application that generates a commit graph for any GitHub repository. It uses Firebase for authentication with GitHub.

The application is hosted on GitHub pages and can be accessed through: https://hitheshr.github.io/commit-graph-plotter/.

## How to Use

To view the commit graph for your GitHub project, follow the steps below:

1. Navigate to https://hitheshr.github.io/commit-graph-plotter/.
2. You'll be presented with a text input field. Enter the URL of your GitHub repository in this field. The URL should be of the following format: https://github.com/<username>/<repo>. For example, if your username is `JohnDoe` and your repository is `MyRepo`, you'd enter `https://github.com/JohnDoe/MyRepo`.
3. Press the 'Submit' button. You'll be redirected to a new page displaying the commit graph of your project.

If you are not authenticated, you'll be presented with a button prompting you to "Authenticate with GitHub". Clicking this will initiate the OAuth process with GitHub. Once authenticated, the commit graph for your repository will be displayed.

## Forking and Setting Up Your Own Firebase-GitHub Authentication

To fork this repository and set up your own Firebase-GitHub authentication, follow the steps below:

1. Fork the repository by clicking on the 'Fork' button at the top-right corner of the repository page.

2. Clone the forked repository to your local machine.

    ```
    git clone https://github.com/<your-username>/commit-graph-plotter.git
    ```

3. Navigate into the project directory.

    ```
    cd commit-graph-plotter
    ```

4. Install the required dependencies.

    ```
    npm install
    ```

5. Create a new Firebase project:

   - Go to the Firebase console (https://console.firebase.google.com/).
   - Click on 'Add project'.
   - Follow the on-screen instructions to create a new project.

6. After creating the Firebase project, you'll need to enable GitHub as a sign-in provider:

   - From the project overview page, click on 'Authentication'.
   - Click on the 'Sign-in method' tab.
   - Scroll down to 'GitHub' and click on it.
   - Set the 'Enable' switch to 'On'.
   - You'll need to provide a 'Client ID' and 'Client Secret', which you can obtain by registering a new OAuth application on GitHub.

7. Register a new OAuth application on GitHub:

   - Navigate to your settings on GitHub.
   - Click on 'Developer settings'.
   - Click on 'OAuth Apps'.
   - Click on 'New OAuth App'.
   - Fill out the form to register a new OAuth application. The 'Authorization callback URL' should match the format: `https://<your-project-id>.firebaseapp.com/__/auth/handler`. Your project ID can be found in the settings of your Firebase project.
   - After creating the app, you'll be presented with a 'Client ID' and 'Client Secret'. Enter these in the Firebase GitHub sign-in provider settings.

8. In the source code of your project, replace the Firebase configuration object in the 'firebase.js' file with your own Firebase project's configuration object.

9. Run the project:

    ```
    npm start
    ```

You now have a working fork of the Commit Graph Plotter with your own Firebase-GitHub authentication.

## Deploying to GitHub Pages

GitHub Pages provides a convenient way to host your forked project. Follow these steps to deploy your project:

1. Before deploying, ensure your project builds successfully. Run:

    ```
    npm run build
    ```

    If your build is successful, proceed to the next step.

2. Update the `"homepage"` field in your `package.json` to match the GitHub Pages URL. It should be of the format `https://<your-username>.github.io/<repository-name>/`. For example:

    ```json
    "homepage": "https://your-username.github.io/commit-graph-plotter/",
    ```

3. In the `"scripts"` field of `package.json`, ensure there are predeploy and deploy scripts:

    ```json
    "scripts": {
        //...
        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"
    },
    ```

    These scripts tell npm to build your app in the predeploy stage and then deploy the build directory to GitHub Pages.

4. Install the `gh-pages` package if it's not already installed. This package will help in deploying your app to GitHub Pages. Run:

    ```
    npm install --save-dev gh-pages
    ```

5. Once everything is set up, deploy your app by running:

    ```
    npm run deploy
    ```

6. Finally, go to your GitHub repository settings, scroll down to the GitHub Pages section, and choose the `gh-pages` branch for your source. The page will reload and you should see a link to your live site.

Now, your forked Commit Graph Plotter is live on your GitHub Pages. Users can access it via `https://<your-username>.github.io/<repository-name>/`.

## Acknowledgements

This project uses code from the [le-git-graph](https://github.com/NirmalScaria/le-git-graph) repository, originally created by Nirmal Scaria and licensed under the MIT License. Modifications were made to adapt the code to this project's requirements.
