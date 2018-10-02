module.exports = {
    apps: [
        {
            name: 'chatbot',
            script: 'index.js',
            exec_mode: 'cluster',
            instances: 0
        },
        {
            name: 'schedule_chatbot',
            script: 'schedule.js',
            exec_mode: 'fork',
            instances: 1
        }
    ]
};