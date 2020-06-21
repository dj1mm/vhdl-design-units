
# I need an easy way to work with vhdl design units

If this applies to you, welcome. Otherwise, you are still welcomed!

This extension aims at making it easier to work with vhdl design units in large
vhdl projects.

## What it is and what it isn't

Vhdl design units (the extension) currently indexes vhdl files it is told to,
and allows you to find vhdl design units in a Ctrl-P fashion. All done with the
help of a very rudimentary typescript parser. So no extra executables to
install to reap the benefits of this extension.

This extension is not a vhdl language server.

Features:

- finds vhdl primary units: entity, package and configuration declarations
- finds vhdl secondary units: architecture and package bodies
- specify which folders to search for vhdl files
- parser is vhdl' typo friendly, but not rigorously tested

## Usage

Configuration

- Search These Directories

When indexing vhdl files, the extension will search for files from the folders
specified there. Do only put valid folders. Why would you do otherwise? Hope it
all goes fine ;)

![configuration](https://user-images.githubusercontent.com/12375343/85230298-218e1b80-b3e7-11ea-9fc2-14d7e85f6aed.PNG)

Drive the extension with two commands:

- Index design units
  ![index](https://user-images.githubusercontent.com/12375343/85230305-24890c00-b3e7-11ea-9579-f655ec0b938e.PNG)

- Find design unit
  ![findunit](https://user-images.githubusercontent.com/12375343/85230303-22bf4880-b3e7-11ea-8974-3667929e08ee.PNG)

**Enjoy!**

