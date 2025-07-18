# Introduction
To automate some processes in Redmine we created a couple of tampermonkey scripts.

## Installation Guide
1. Install Tampermonkey plugin in favourite browser.
2. Create new script in Tampermonkey and copy/paste content
3. Make sure the new script is enabled
4. Refresh the page where the script should work to see extra buttons

## Update Guide
1. Go to the script to update in Tampermonkey
2. Edit the plugin
3. copy/paste the content from this repo to the plugin file editor.
4. Save the plugin
5. Refresh the page where the script should work to see extra buttons

## Scripts
### Redmine Agile Board Buttons
- Adds an overview button that shows all the stories for each individual team.
- Orders by priority and shows Moscow and assigned person.

### Redmine New Issue Template
- Adds a button to prefill/append Ticket/Bug templates on the new issue page.
- All buttons will also set the MoSCoW to (C) Could Have if it was empty.
- Buttons will change the type task to Change or Bug.
- These buttons will also show when creating subtasks.

### Redmine Ticket Buttons
- Adds a button to copy a commit message to the clipboard.
- Adds a button to copy the agreed branch name format to the clipboard.
- Adds a button to copy a Ticket Announcement to the clipboard for slack.
  
### Microsoft Login Favicons
- Adds a favicon logo per account based on the domain of the account.

# Contribute
- If changes are made, inform the team so scripts can be updated on everyone's machine.
- Auto updates did not work because this repository is protected by ADFS so tampermonkey cant poll for new versions.

# Links
- [TamperMonkey](https://www.tampermonkey.net/)
