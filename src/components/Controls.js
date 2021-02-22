import React from 'react';
import { useStoreon } from 'storeon/react';

//import { Actions, Message, Dialogue } from 'components/controls';
//import { STATUSES } from 'lib/game';

const Controls = () => {
    const { dispatch, gameState: { isLoading, status }, ui: { message } } = useStoreon('gameState', 'ui');

    if (isLoading) return null;

    if (status === STATUSES.SPEAKING) {
        return (
            <div className="flex-1 flex items-center bg-gray-400">
                {status === STATUSES.SPEAKING && !message && <Dialogue />}
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-gray-400">
            {message && <Message {...message} onDismiss={() => dispatch('clearMessage')} />}
            {status === STATUSES.IDLE && !message && <Actions />}
        </div>
    );
};

export default Controls;