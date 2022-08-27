const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

fs.copyFile('bin/aws-exports.js.template', 'src/aws-exports.js', (err) => {
    if (err) {
        console.log(err.stack);
    }
});

const questions = [
    {
        name: "spaceId",
        message: "Your Contentful Space ID",
        when: !process.env.CONTENTFUL_SPACE_ID,
        validate: (input) =>
            /^[a-z0-9]{12}$/.test(input) ||
            "Space ID must be 12 lowercase characters",
    },
    {
        name: "accessToken",
        when: !process.env.CONTENTFUL_ACCESS_TOKEN_TOKEN,
        message: "Your Contentful Content Delivery API access token",
    },
];

inquirer
    .prompt(questions)
    .then(({ spaceId, accessToken }) => {
        const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

        // env vars are given precedence followed by args provided to the setup
        // followed by input given to prompts displayed by the setup script
        spaceId = CONTENTFUL_SPACE_ID || spaceId;
        accessToken = CONTENTFUL_ACCESS_TOKEN || accessToken;

        console.log("Writing config file...");
        const configFiles = [`.env.development`, `.env.production`].map((file) =>
            path.join(__dirname, "..", file)
        );

        const fileContents =
            [
                `# All environment variables will be sourced`,
                `# and made available to gatsby-config.js, gatsby-node.js, etc.`,
                `# Do NOT commit this file to source control`,
                `CONTENTFUL_SPACE_ID='${spaceId}'`,
                `CONTENTFUL_ACCESS_TOKEN='${accessToken}'`,
                `GATSBY_SALON_NAME = 'Sample Salon'`,
                `GATSBY_BOOKING_STATUS_ENDPOINT = https://thirosue.github.io/hosting-image/booking`,
                `GATSBY_SENTRY_DSN = emptry`,
                `GATSBY_TRACE = 0`,
                `GATSBY_DISABLE_SIGN_UP=1`
            ].join("\n") + "\n";

        configFiles.forEach((file) => {
            fs.writeFileSync(file, fileContents, "utf8");
            console.log(`Config file ${chalk.yellow(file)} written`);
        });
        return { spaceId };
    })
    .then((_, error) => {
        console.log(
            `All set! You can now run ${chalk.yellow(
                "yarn develop"
            )} to see it in action.`
        );
    })
    .catch((error) => console.error(error));
