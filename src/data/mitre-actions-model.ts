export const MITER_ACTIONS = {
    id: 0,
    action: 'root',
    children: [
        {
        id: 1,
        action: 'Initial Access',
        children: [
            {id: 2, action: 'Drive-by Compromise'},
            {id: 3, action: 'Exploit Public-Facing Application'},
            {id: 4,  action: 'External Remote Services'},
            {id: 5, action: 'Hardware Additions'},
            {id: 6, action: 'Replication Through Removable Media'},
            {id: 7, action: 'Spearphishing Attachment'},
            {id: 8, action: 'Spearphishing Link'},
            {id: 9, action: 'Spearphishing via Service'},
            {id: 10, action: 'Supply Chain Compromise'},
            {id: 11, action: 'Trusted Relationship'},
            {id: 12, action: 'Valid Accounts'},
        ]
    },        {
        id: 13,
        action: 'Execution',
        children: [
            {id: 14, action: 'AppleScript'},
            {id: 15, action: 'CMSTP'},
            {id: 16, action: 'Command-Line Interface'},
            {id: 17, action: 'Compiled HTML File'},
            {id: 18, action: 'Component Object Model'},
            {id: 19, action: 'Control Panel Items'},
            {id: 20, action: 'Dynamic Data Exchange'},
            {id: 21, action: 'Execution through API'},
            {id: 22, action: 'Execution through Module Load'},
            {id: 23, action: 'Exploitation for Client Execution'},
            {id: 24, action: 'Graphical User Interface'},
            {id: 25, action: 'InstallUtil'}, // there are more
        ]
    },
    ]
};
