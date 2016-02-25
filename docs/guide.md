# Adding a By-law

Thanks for helping out! This project only works because our community members, people like you, help make it work.

We're going to take you through how to add a new by-law to Open By-laws website using the Indigo platform.

We're going to focus on the process of adding a new by-law. The process for **amending an existing by-law** is similar but has a few more details.

## Understanding the law

First, it's a good idea to have a rough understanding of how laws and by-laws work in South Africa. The Indigo documentation has an good [Introduction to the terminology of law](http://indigo.readthedocs.org/en/latest/guide/law-intro.html) prepared by Adrienne Pretorius, a legal editor with many ears of experience.

It doesn't take long to read through and the ideas are straight-forward. In particular, please ensure you understand:

* [Publications of Acts](http://indigo.readthedocs.org/en/latest/guide/law-intro.html#publication-of-acts)
* [Components of an Act](http://indigo.readthedocs.org/en/latest/guide/law-intro.html#components-parts-of-an-act)

It's also import to read and understand [how Indigo separates out the **content** of legislation from the **styling**](http://indigo.readthedocs.org/en/latest/guide/principles.html).

## 1. Finding a document to import

Thankfully you don't need to re-type the entire by-law. Indigo can import text from PDFs, Word and RTF documents, among others. You need to find
an existing version of the by-law to import.

When looking for a by-law to import, keep these guidelines in mind:

* it's not official unless it's published in a Gazette
* a version from an official source, such as a published Gazette, is best
* don't use a draft version; small, important details can change
* if you have a scanned document, you'll need to OCR it to convert it to text

Municipalities must make their by-laws available to the public. Most do so on their websites, although they're often
out of date or incomplete. They're a good start.

## 2. Importing the document

Once you've got your document, you can import it into Indigo.

* Log into your account on [indigo.openbylaws.org.za](https://indigo.openbylaws.org.za)
* In the Library view, click **New > Import a document**
* Drag and drop your file into the box (or click the **Choose a file** button)
* If you need to, tell Indigo how the section titles of your document are formatted.
* Click **Import document**

Indigo will take a few minutes to do the hard work of importing your document.

Once it's done, it'll show you your newly imported document. Next up is telling Indigo more about what you
just imported.

*(Read more about [importing a document into Indigo](http://indigo.readthedocs.org/en/latest/guide/managing.html#importing-a-new-document).)*

## 3. Metadata: titles, dates, etc.

### Basic details

* **Short title:** find the *official* short title for the document. This is generally in a section called **Short Title**. If that doesn't exist, use the title at the top of the document.
* **Country:** make sure this is *South Africa*
* **Locality:** choose the municipality this by-law is for
* **Language:** this should be the language the by-law is in, generally English
* **Document subtype:** choose *By-law**
* **Year:** in what year was this by-law published?
* **Number:** most by-laws aren't numbered, but we need a way to identify this by-law. This value will also be used as a filename and as a web address.
  1. Take the title of the by-law and remove any reference to the municipality
  2. Remove any words like *the*, *for*, *of*, *to* etc.
  3. Remove the word *by-law* and the year
  4. Replace all spaces with hyphens and make it all lowercase
  5. For example, "eThekwini Municipality: Problem Buildings By-law, 2015" becomes "problem-buildings"

### Promulgation

This information relates to when the by-law was published or *promulgated*.

* **Publication date:** on what date was the by-law published?
* **Publication name:** use the name of the provincial gazette, such as: *Western Cape Provincial Gazette*
* **Publication number:** what gazette number was it published in?
* **Assent date** and **Commencement date:** you can leave these empty
* **Expression date:** change this to match the publication date
* Click Save

*(Read more about [editing document metadata in Indigo](http://indigo.readthedocs.org/en/latest/guide/metadata.html).)*

### Attachments

When you imported your by-law Indigo saved your original document as an *attachment*. The
openbylaws.org.za website will let users download your original version so that they can verify
for themselves that what we're providing is accurate. To do this, the attachment must be correctly
named.

* Click **attachments** in the left hand menu
* Click the pencil icon alongside your original document's name
* Change the attachment filename to **source-enacted.pdf**

This tells Indigo that this document is the original source of the by-law as it was first enacted.

You can also delete and upload different attachments if you need to.

## 4. Proofing and editing

Now you need to clean up what Indigo has imported.

**Don't forget to click *Save* after you've made a change**

1. Remove the table of contents. It can really confuse Indigo. It's not necessary because Indigo will create a
   table of contents automatically.
2. Check numbering
  * Run your eye down the table of contents on the left
  * Ensure **chapters** and **parts** have numbers and titles
  * Ensure **sections** have numbers and titles
3. For each section, check the numbering of sub-items
  * Check that **(a)**, **(b)** etc always start a new line
  * Check that the **last item** in a numbered list is correct
4. Check that lines aren't broken incorrectly. **Almost every line should start with a section or subsection number.**
5. Check that schedules have been captured correctly.

**Don't forget to click *Save* after you've made a change**

## 5. Publishing

Great, you've now proofed your document and it's ready to be published on the openbylaws.org.za website.

1. Please email [hello@openbylaws.org.za](mailto:hello@openbylaws.org.za) and tell him that your by-law is good to go.
2. We'll double-check the details and change the document from **draft** to **published**.
3. We'll also start a new build of the openbylaws.org.za website which will pull in your new document. This make take an hour
   or two to show up when you visit the website.

Thanks for contributing!

## Further reading

* [Introduction to the terminology of law](http://indigo.readthedocs.org/en/latest/guide/law-intro.html)
* [The Indigo Platform documentation](http://indigo.readthedocs.org/en/latest/index.html)
