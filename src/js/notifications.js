
	var Notifications = (function () {
		
		var list, notificationCount = 0, preRemoveEvents = [];
		
		var init = function () {
			
			list = c.DOM.create('ul');
			list.id = 'uv-notifications';
			
			document.body.appendChild(list);
			
		};
		
		var add = function (content, preRemove) {
		
			notificationCount++;
			
			c.Template.get('notification', function (notification) {
				
				var btn = c.DOM.getOne('.btn-del', notification);
				if (btn) {
					btn.addEventListener('click', function (e) {
						remove(this.parentNode.getAttribute('data-id'));
					});
				}
				
				if ("undefined" !== typeof preRemove) {
					preRemoveEvents[notificationCount] = preRemove;
				}
				
				list.appendChild(notification);
				
				setTimeout(function () {
					notification.classList.add('show');
				}, 100);
				
			}, {'content': content, 'id': notificationCount});
			
			return notificationCount;
			
		};
		
		var remove = function (notificationId) {
			
			var notification = c.DOM.get('#uv-notification-'+notificationId), preRemove;
			if (notification) {
				notification.classList.remove('show');
				
				if (typeof (preRemove = preRemoveEvents[notificationId]) !== "undefined") {
					preRemove.call(null);
				}
				
				setTimeout(function () {
					notification.parentNode.removeChild(notification);
				}, 500);
			}
			
		};
		
		return {'init': init, 'add': add, 'remove': remove};
		
	}());
	
	c['Notifications'] = Notifications;
	