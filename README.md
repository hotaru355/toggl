Toggl Command Line Client
=========================

A simple client for the Toggl API to start and stop time entries.

Note: Start with --harmony flag as it uses generators

Usage:

    app.js [ start -d <desc> -p <projectId || stop [ -i <entryId> | -c ] ]

 Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    start                        Start a time entry
    -d, --entry-desc <desc>      description of the time entry
    -p, --projectId <projectId>  project ID of the time entry
    stop                         Stop a time entry
    -i, --entry-id <entryId>     ID of time entry
    -c, --current                stop current time entry
