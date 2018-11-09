export default {

snapQA:'snapQ&A',
accountAddr:'Account address',
amount:'Amount',
moac_balance:'moac balance',
coin_balance:'coin balance',
block_Info:'MotherChain#/MicroChain#/Refresh',

ACTION: {
    recharge:'Recharge ',
    withdraw:'Withdraw ',
    confirm:'Confirm',
    cancel:'Cancel',
    recover:'Recover',
    block:'Block',
    submit:'Submit',
    login:'Login',
    logout:'Logout',
    transfer:'Transfer',
    exchange:'Exchange',
    sign_up:'Sign up',
    back:'Back',
    processing:'processing'
},

INFO: {
    footerRefreshingText:'Strive to load... >.<',
    footerFailureText:'Emmmm...，fail for some reason =.=!',
    footerNoMoreDataText:'-No more data-',
    footerEmptyDataText:'-Seems nothing left here-',
    blockChain_Info:'Blockchain Info',
    ten_multiples:'Please input multiples of 10'
},

ALERT: {
    recharge_confirm: 'Are you sure you want to recharge?',
    withdraw_confirm: 'Are you sure you want to withdraw?',
    transfer_confirm: 'Are you sure you want to transfer?',
    clicked:'Clicked'
},

SUCCESS: {
    userInfo_clip:'Copied to clipboard，now you can paste to where you want to backup',
    accountAddr_clip:'Account address copied to clipboard，paste to where you want to backup',
    recharge_request_sent:'Recharge request sent. Balance will update in minutes',
    withdraw_request_sent:'Withdrew request sent. Balance will update in minutes',
    transfer_request_sent:'Transfer request sent. Balance will update in minutes',
    cancel_success:'Cancel successful',
    login_success:'Login successful',
    recover_success:'Recover successful',
    register_success:'Register successful，please backup account address and keyStore',
    question_success:'Success,please refresh after 20S',
    block_success:'Block successful',
    comment_success:'Comment successful'
},

FAIL: {
    recharge_fail:'Recharge fail, please try again',
    withdraw_fail:'Withdraw fail, please try again',
    transfer_fail:'Transfer fail, please try again',
    not_logged_in:'Please login',
    login_fail:'Login fail',
    input_amount_exception:'Invalid input',
    input_content_exception:'Invalid input',
    insufficient_moac_balance:'Not enough moac in balance',
    insufficient_coin_balance:'Not enough coin in balance',
    no_available_export_keyStore:'No valid keyStore found，please use keyStore login',
    wrong_keyStore:'keyStore is not available',
    exception_keyStore:'Exception: wrong keyStore',
    empty_keyStore:'keystore is empty',
    incorrect_password:'Password incorrect',
    empty_password:'Password is empty',
    length_password:'Passwords must be at least 12 characters long',
    unmatch_password:'Password not match',
    incorrect_UP:'Incorrect password or username',
    empty_dist:'You must enter address you want to transfer to',
    wrong_account_addr:'Error on account address',
    wrong_award_amount:'Error on award',
    wrong_duration_input:'Error on time duration',
    maximum_duration:'The maximum duration time is ',
    wrong_input_question:'Error on input question',
    recover_request_fail:'Fail to request recover',
    block_request_fail:'Fail to request block',
    expired_question:'Question is expired',
    repeated_thumbUp:'You already like this',
    answer_fail:'Fail to answer',
    expired_answer:'The answer is expired'
},

REMINDER:{
    reminder:'Reminder',
    reminder_text1:'Coins in specific Microchain section are not available in other sections. Your have to exchange new coin with MOAC in Motherchain',
    reminder_text2:'1:Question will be listed when microchain height refreshed',
    reminder_text3:'2:When a question expired, only questioner can access it',
    after_register:"After sign up，please take care of you account address, keyStore and password. Get several copies and keep secret from others。Your account only accessible by yourself. It cannot be retrieved if lost"
},

PLACEHOLDER: {
    input_moac_exchange:'moac amount',
    input_coin_exchange:'coin amount',
    input_coin_award:'Coins',
    input_dist_address:'Input address of target account',
    input_coin_transfer:'Coin to transfer',
    input_username:'Username',
    input_password:'Password',
    input_keyStore:'keyStore',
    input_new_password:'New password',
    repeat_new_password:'Repeat new password',
    input_question:'Question(140 words limited)',
    input_answer:'Answer(140 words limited)'
},

MainMenu:{
     press_Exit:'Press again to exit application',
     section_Unavailable: 'Section is currently not available, please try later',
     backup_node_connected: 'Backup node connect successful',
     backup_remote_sever_connected:'Backup remote sever connect successful！',
     Exception_obtainChainInfo:'Exception caught when obtain chain information！',
     what_is_interested:'What\'s your interest'
},

Lmain:{
   question:'QN',
   question_list:'QN list',
   profile:'Profile'
},

Profile:{
    about:{
       about:'About snapQ&A',
       version:'Version '
    },
    accountHistory:{
        record:'Record',
        completed:'Completed'
    },
    accountInfo: {
        accountInfo:'Account Info',
        exchange_rate:'Exchange rate',
        export_keyStore:'Export keystore',
        export_accountAddr:'Export account address'
    },
    changeAccount:{
        switch_account:'Switch Account',
        new_account_login:'login with other account'
    },
    mainChain:{
        mainChain_info:'Motherchain Info'
    },
    personalCenter: {
        personal_center:'Profile'
    },
    transferAccounts:{
        user_transfer:'Transfer',
        dist_address:'Target address',
        transfer_amount:'Transfer amount',
        moac_transfer:'moacTRF',
        coin_transfer:'coinTRF'
    }
},

    LoginView:{
        changeAccountLogin:{
            keyStoreLogin:'keyStore Login'
        },
        keyStoreLoginView:{
                    keyStoreLogin:'keyStore Login',
                    localLogin:'Local Login'
                },
        localLoginView:{
                    localLogin:'Local Login'
        },
        registerLogin:{
                    account_addr:'Account Address',
                    keyStore_backup:'BKUP keyStore'
        }
    },

    LianWenHome:{
        addNewQuestion:{
            please_input:'Multiples of ',
            multiples:'',
            expect_duration:'Duration time must be multiple of ',
            integer:'',
            not_enough_coin:'Not enough coin to pay award',
            award:'Award',
            duration_time:'Duration(Second)'
        },
        lianWenGroup:{
            module_group:'Module Group'
        },
        lianWenSettlement:{
            comment_list_for_questions:'Q&A List',
            comment_list:'Comment List'
        },
        questionDetail:{
            new_comment:'New comment'
        },
        questionDetailAddComment:{
            answer:'Answer',
            typed:'typed ',
            words:' words'
        },
        lianWenHomeYouLike: {
                    award:'Award',
                    time:'Time',
                    latest_question:'Latest question'
                }
    },

    CommonComp: {
        list: {
            test_list:'List test'
        }
    }

}