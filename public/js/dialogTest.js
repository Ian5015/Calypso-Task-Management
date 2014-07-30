/**
 * !!! You need to include the "dialogs.default-translations" module if you are not using 
 * angular-translate (pascalprecht.translate) elsewhere in your application.  It was separated
 * out from the dialog service because it interferes with already provided translations elsewhere.
 * If you are already using angular-translate then just add the translations found in "dialogs.default-translations"
 * module to your translations and then there's no need to include the default module.
 */

angular.module('modalTest',['ui.bootstrap','dialogs.main','dialogs.default-translations','pascalprecht.translate', 'angoose.client'])
	.controller('dialogServiceTest',function($scope,$rootScope,$timeout,$translate,dialogs, User, Job){

		//-- Variables --//

        var workers = $scope.workers = User.$query();
        var jobs    = $scope.jobs    = Job.$query();
        
		$scope.lang = 'en-US';
		$scope.language = 'English';

		var _progress = 33;

		$scope.name = '';
		$scope.confirmed = 'No confirmation yet!';

		$scope.custom = {
			val: 'Initial Value'
		};

		//-- Listeners & Watchers --//

		$scope.$watch('lang',function(val,old){
			switch(val){
				case 'en-US':
					$scope.language = 'English';
					break;
				case 'es':
					$scope.language = 'Spanish';
					break;
			}
		});

		//-- Methods --//

		$scope.setLanguage = function(lang){
			$scope.lang = lang;
			$translate.use(lang);
		};

		$scope.launch = function(which){
			switch(which){
				case 'error':
					dialogs.error();
					break;
				case 'wait':
					var dlg = dialogs.wait(undefined,undefined,_progress);
					_fakeWaitProgress();
					break;
				case 'customwait':
					var dlg = dialogs.wait('Custom Wait Header','Custom Wait Message',_progress);
					_fakeWaitProgress();
					break;
				case 'notify':
					dialogs.notify();
					break;
				case 'confirm':
					var dlg = dialogs.confirm();
					dlg.result.then(function(btn){
						$scope.confirmed = 'You confirmed "Yes."';
					},function(btn){
						$scope.confirmed = 'You confirmed "No."';
					});
					break;
				case 'custom':
					var dlg = dialogs.create('/dialogs/custom.html','customDialogCtrl',{},{size:'lg',keyboard: true,backdrop: false,windowClass: 'my-class'});
					dlg.result.then(function(name){
						$scope.name = name;
					},function(){
						if(angular.equals($scope.name,''))
							$scope.name = 'You did not enter in your name!';
					});
					break;
				case 'custom2':
					var dlg = dialogs.create('/dialogs/custom2.html','customDialogCtrl2',$scope.custom,{size:'lg'});
					break;
			}
		}; // end launch

		var _fakeWaitProgress = function(){
			$timeout(function(){
				if(_progress < 100){
					_progress += 33;
					$rootScope.$broadcast('dialogs.wait.progress',{'progress' : _progress});
					_fakeWaitProgress();
				}else{
					$rootScope.$broadcast('dialogs.wait.complete');
				}
			},1000);
		};
	}) // end controller(dialogsServiceTest)

	.controller('customDialogCtrl',function($scope,$modalInstance,data){
		//-- Variables --//

		$scope.user = {name : ''};

		//-- Methods --//

		$scope.cancel = function(){
			$modalInstance.dismiss('Canceled');
		}; // end cancel

		$scope.save = function(){
			$modalInstance.close($scope.user.name);
		}; // end save

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.user.name,null) || angular.equals($scope.user.name,'')))
				$scope.save();
		};
	}) // end controller(customDialogCtrl)

	.controller('customDialogCtrl2',function($scope,$modalInstance,data){

		$scope.data = data;

		//-- Methods --//

		$scope.done = function(){
			$modalInstance.close($scope.data);
		}; // end done

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.user.name,null) || angular.equals($scope.user.name,'')))
				$scope.done();
		};
	})

	.config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');

		$translateProvider.translations('es',{
			DIALOGS_ERROR: "Error",
			DIALOGS_ERROR_MSG: "Se ha producido un error desconocido.",
			DIALOGS_CLOSE: "Cerca",
			DIALOGS_PLEASE_WAIT: "Espere por favor",
			DIALOGS_PLEASE_WAIT_ELIPS: "Espere por favor...",
			DIALOGS_PLEASE_WAIT_MSG: "Esperando en la operacion para completar.",
			DIALOGS_PERCENT_COMPLETE: "% Completado",
			DIALOGS_NOTIFICATION: "Notificacion",
			DIALOGS_NOTIFICATION_MSG: "Notificacion de aplicacion Desconocido.",
			DIALOGS_CONFIRMATION: "Confirmacion",
			DIALOGS_CONFIRMATION_MSG: "Se requiere confirmacion.",
			DIALOGS_OK: "Bueno",
			DIALOGS_YES: "Si",
			DIALOGS_NO: "No"
		});

		$translateProvider.preferredLanguage('en-US');
	}])

	.run(['$templateCache',function($templateCache){
  		$templateCache.put('/dialogs/custom.html','<div ng-app=modalTest class=modal-header><h4 class=modal-title><span class="glyphicon glyphicon-star"></span>Create New Job</h4></div><div class=modal-body><form ng-controller=dialogServiceTest action=/create method=POST class=form-horizontal><fieldset><div class=control-group><label class=control-label for=location>Location</label><div class=controls><input id=location name=location placeholder="Enter the location of the work to be completed..." class=input-xxlarge></div></div><div class=control-group><label class=control-label for=selectPriority>Select Priority</label><div class=controls><select id=selectPriority name=priority class=input-small><option>Low<option>High</select></div></div><div class=control-group><label class=control-label for=selectWorker>Select Worker</label><div class=controls><select id=selectWorker name=worker class=input-medium><option ng-repeat="worker in workers">{{ worker.local.email }}</select></div></div></fieldset><button type=button class="btn btn-default" ng-click=cancel()>Cancel</button> <button type=submit ng-click="done()" class="btn btn-primary" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></form></div>');
  		$templateCache.put('/dialogs/custom2.html','<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> Custom Dialog 2</h4></div><div class="modal-body"><label class="control-label" for="customValue">Custom Value:</label><input type="text" class="form-control" id="customValue" ng-model="data.val" ng-keyup="hitEnter($event)"><span class="help-block">Using "dialogsProvider.useCopy(false)" in your applications config function will allow data passed to a custom dialog to retain its two-way binding with the scope of the calling controller.</span></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="done()">Done</button></div>')
	}]); 