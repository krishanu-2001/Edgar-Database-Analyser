### SEC Edgar database analyser
This is a combined archive which houses all the submodules of project. <br>

<img width="247" alt="image" src="https://user-images.githubusercontent.com/56930593/186934249-7ed03a93-1c86-4f01-962b-594871248a14.png"> 

### UPDATE (May 2020)

**If you still use ProKeys, do not worry!** It will continue to work as it has worked so far. I own the extension on the Web Store, and I am NOT going to sell this extension off to a third party, since I am aware that this extension handles critical personal user data, and the chances that a third party could potentially sell that data are large.

**Note**: Even though work on this project is halted, we are not giving up the rights to the name on the Web Store. The ProKeys extension still continues to exist on the Web Store. It is still being regularly used by 20k+ users globally. The license terms still remain intact.

![version](https://img.shields.io/badge/version-3.4.1-blue)
![license](https://img.shields.io/github/license/krishanu-2001/Edgar-Database-Analyser)
![contributors](https://img.shields.io/badge/contributors-10-brightgreen)  

![stars](https://img.shields.io/badge/stars-3-blue)
![fork](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

[More info on all these in Help section inside the app]

1.  **Snippets** - define custom abbreviations, and retrieve the text associated with them simply by pressing the hotkey (default: Shift+Space). Example: "brb" can expand to "Be right back!"
2.  **Placeholders** - are fields in the snippet body that can be given dynamic values on using the snippet.
3.  **Mathomania** - do math without leaving your text editor, and without calculators. Example: "[[ 15% * 600 =]]" gives "90" and "[[ (5+6) * 15^2 =]]" gives "2475".
4.  **Clipboard access** - insert `[[%p]]` anywhere in your snippet body. It will automatically be substituted with the current clipboard data.
5.  **Snippet embedding**: you can embed one or more snippets inside another snippet, simply by doing `[[%s(snip_name)]]`.
6.  **Auto-Insert** - Quotes ('"') and braces ('(', '[', '{') are auto-completed, and you can specify your custom insert-it-for-me also (like, inserting a '>' on typing of a '<') in the settings.
7.  **Date/Time Macros** - embed short symbols inside the parentheses of '[[%d()]]' inside a snippet body and it will auto replace the symbol with the current date and time related value. A sample snippet as well as a guide has been provided (in Help section inside the app). **Date/Time Arithmetic** - use the `+` or `-` sign to move forward or backward in time in date/time macros. Supports both relative as well as independent evaluation.
8.  **Omnibox support** - search through your snippets and use them right in the browser address bar!
9.  **URL Macro** - insert customizable parts of the current tab URL into the snippet.
10. **Variables** - built-in variables holding dynamic values for "date", "time" and (browser) "version"
11. **Tab Key** - The tab key can be made to insert 4 spaces, instead of it's default function, thus speeding up work.
12. **Context menu access** - for blocking sites and inserting snippets.
13. **Sync/Local storage** - Use whichever you prefer.

## Libraries/Code sources

Except for the feather-weight open-source QuillJS rich text editor, I only utilized vanilla JS for super performance and less app size. Also Eric Meyer's CSS reset stylesheet - public domain - has been used with modifications.

Some icon images have been sourced from Font Awesome 5. The license is at [this link](https://fontawesome.com/license/free). No changes (except scaling) were made to these images.

## References
Links to original repositories are  

1. https://github.com/Web-Team-IITI-Gymkhana/data-bot 
2. https://github.com/Web-Team-IITI-Gymkhana/saas-client
3. https://github.com/Web-Team-IITI-Gymkhana/saas-server

## Technical details

Are shared on [here](http://electricweb.org/chrome-extension-tutorial-snippets) in a long, three post series. In brief: this extension uses content scripts which are injected into every page and (what follows is for the snippet functionality only) every time the user presses the hotkey, a check is made for the preceding text, which if matches the name of any of the snippets, is substituted with the snippet body. A subsequent test for placeholders is made as well.

## Contribute

First of all, thanks for your contribution! Every small bit of it counts! You can:

1.  [Create a new issue](https://github.com/GaurangTandon/ProKeys/issues/new) for bugs, feature requests, and enhancements.
2.  [Write a review](https://chrome.google.com/webstore/detail/prokeys/ekfnbpgmmeahnnlpjibofkobpdkifapn/reviews) (or [anonymous feedback](https://docs.google.com/forms/d/1DcwQB5vnNCH0pP_Y-wVvOF6gsI0gaXGPPngctb4tCdA/viewform?usp=send_form)), or [get support](https://chrome.google.com/webstore/detail/prokeys/ekfnbpgmmeahnnlpjibofkobpdkifapn/support) with some technical problems.
3.  Fork the repo, make changes, and submit a pull request, describing the changes made.
4.  Help me translate ProKeys to your native language.
5.  Share the word about ProKeys with people!
6.  Monetary donations are gratefully accepted at email 1gaurangtandon@gmail.com using [PayPal](https://www.paypal.com/myaccount/transfer/buy)

## Development

To setup this repo, clone it, `cd` into it, and then run `npm run build`. This will create a unminified development build in `./dist` which you can then load into Chrome. This step is required because Chrome does not yet natively support `import`/`export` syntax for Chrome extensions.

We use both global variables and `import`/`export` ones. The `import`/`export` ones are either functions or unmodified constants. Only those variables are declared under `window` which need to be modified in different scripts.

**Contact us** - prokeys.feedback@gmail.com - to discuss anything related to the above if you want to.

## [Known Issues](https://docs.google.com/document/d/1_MHKm1jtpJCWgksfbUdufExRFlF81S-IuTz1Czu7gOI/edit?usp=sharing)

## [Change Log](https://github.com/GaurangTandon/ProKeys/blob/master/change_log.md)
