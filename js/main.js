(function($){
    $(document).ready(function(){


        var memos = (function() {
            var list =[];
           
            var renderEngine = null;

            var generateId = function () {
                var newId;

                do {
                    newId = Math.floor(Math.random() * 99999) + 10000;
                } while (null !== get(newId));
                
                return newId;
            };

            var get = function (id) {
                var i, j, taskFound;
                j = list.length;

                for(i=0; i<j; i++) {
                    if (list[i].id === id) {
                        taskFound = $.extend(true, {}, list[i]);
                        taskFound;

                        return taskFound;
                    }
                }

                return null;
            };

            var setRanderEngine = function(newRanderEngine) {
                renderEngine = newRanderEngine;
            }

            var add = function (title, text, date) {
                
                var curentDate = new Date();
                date = date||curentDate;

                var id = generateId();

                list.push({
                    id: id,
                    title: title,
                    date: date,
                    text: text
                });


                if (null !== renderEngine) {
                    renderEngine.renderMemo(get(id));
                };

                return id;
            };

            var getIndex = function (id) {
                var i, j;
                j = list.length;

                for(i=0; i<j; i++) {
                    if (list[i].id === id) {
                        return i;
                    }
                }

                return null;
            };

            var remove = function (id) {
                var index = getIndex(id);

                if (null !== index) {
                    list.splice(index, 1);

                    if (null !== renderEngine) {
                        renderEngine.removeMemo(id);
                    }
                }
            };

            return {
                setRanderEngine: setRanderEngine,
                add: add,
                remove: remove
                }
        })();

        var memosCardRander = (function() {
            var $container = null;

            var setContainer = function (selector) {
                $container = $(selector);
            };

            var formatDate = function (date) {
                return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear()+'r';
            };

            var createMemoNode = function(memo) {
                var node=
                '<div class="col-sm-12 col-lg-4 col-md-6" data-memo-id="'+memo.id+'">'+
                    '<div class="card">'+
                        '<div class="card-body bg-yellow">'+
                            '<h5 class="card-title">'+memo.title+'</h5>'+
                            '<h6 class="card-subtitle mb-2 text-muted">'+formatDate(memo.date)+'</h6>'+
                            '<p class="card-text">'+memo.text+'</p>'+
                            '<a href="#" class="btn btn-primary js--delete-memo-btn" data-memo-id="'+memo.id+'">del</a>'+
                        '</div>'+
                    '</div>'+
                '</div>'; 
               
                return node;               
            };

            var renderMemo = function(memo) {
                $container.find('.js--memo-add-new').after(createMemoNode(memo));
            };

            var rerender = function (memos) {
                $container.empty();

                memos.forEach(function (memo) {
                    renderMemo(memo);
                });
            };

            var findMemoNode = function (id) {
                return $container.find('[data-memo-id="'+id+'"]');
            };

            var removeMemo = function (id) {
                var $memoNode = findMemoNode(id);

                $memoNode.remove();
            };

            return {
                setContainer: setContainer,
                renderMemo: renderMemo,
                rerender: rerender,
                removeMemo: removeMemo
            }

        
        })();
        
        memosCardRander.setContainer('.js--memo-container');

        memos.setRanderEngine(memosCardRander);

        memos.add('aaa', 'sssss');


        $('.js--memo-container').on('click', '.js--delete-memo-btn', function () {
            var $this = $(this);
            var memoId = parseInt($this.attr('data-memo-id'));
            memos.remove(memoId);
        });


        //form validator

        var $memoTitle=$('.memoTitle');
        var $memoText=$('.memoText');
        var $memoForm=$('.js--add-memo-form')
        var $addMemoBtn=$('.js--add-memo-btn')

        $memoForm.submit(function(evt) {
            evt.preventDefault();

            if(!isFormValid()){
                return false;
            }
        
            var $form = $(this);
            var formData = {};
            var $filds=$memoForm.find(':input:not(:button)');

            $form.serializeArray().forEach(function (obj, key) {
                formData[obj.name] = $.trim(obj.value);
            });

            if (formData.memoTitle.length > 0) {
               memos.add(formData.memoTitle, formData.memoText) 
            }
            $filds.val('');  
            $filds.removeClass('is-valid');
            $addMemoBtn.prop('disabled', 'disabled') 

        });


        function validateFildMinMax(fild, min, max) {
            $fild=$(fild);
            // console.log($fild.val().length);
            fildValuelenght=$fild.val().length;

            // console.log(min +' - '+fildValuelenght+' - '+ max);
            // console.log(fildValuelenght>=min && fildValuelenght<=max);


            if (min<=fildValuelenght && max>=fildValuelenght){
                $fild.removeClass('is-invalid')
                $fild.addClass('is-valid') 
                return true;
            }

            $fild.removeClass('is-valid')
            $fild.addClass('is-invalid')
            return false;

        }

        function isFormValid() {
            var $filds=$memoForm.find(':input:not(:button)');
            var areValid=true;
            $filds.each(function () {
                if (!$(this).hasClass('is-valid')){
                    areValid=false;
                }
            })
            return areValid;
        }

        function addMemoBtnDisabled() {
            if (isFormValid()) { 
                    $addMemoBtn.prop('disabled', '')
                } else{
                    $addMemoBtn.prop('disabled', 'disabled')
                }
        }

        $memoTitle.on('keyup', function () {
            // console.log(this);
            validateFildMinMax(this,3,10);
            addMemoBtnDisabled();
        });
        $memoText.on('keyup', function () {
            validateFildMinMax(this,3,60); 
            addMemoBtnDisabled();
        })

    });
})(jQuery);