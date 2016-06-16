﻿var InventoryStaiton = InventoryStaiton || {};


InventoryStaiton.QuestionCategoryTree = function () {
    var that = this;

    this.changeNodeSelection = function (id, name, field) {
        var selectedItems = $("#" + field).find('.jstree-clicked');

        $.each(selectedItems, function () {
            $(this).removeClass('jstree-clicked').parent().attr('aria-selected', false);;
        });
        that.categoryPostBack(id, name);
    }

    this.categoryPostBack = function (id, name) {
        //$('#categoryId').val(id);
        //$('#categoryName').val(name);
        //$('#CategoryTreeViewModel_SelectedCategoryName').val(name);
        var $form = $('#categoryId').parents('form');
        $form.attr('action', '/Kit/SelectCategory');
        $form[0].submit();
    }


    this.initializeTree = function () {
        if ($("#treeCell").jstree() != null)
            $("#treeCell").jstree().destroy();
        $("#treeCell").jstree({
            "core":
                {
                    "html_titles": true,
                    "load_open": true,
                    "data": {
                        "url": function (node) {
                            var selCatId = $('#categoryId').val();
                            var url = "/QuestionCategory/GetCategoryChildren?catId=" + (node.id === "#" ? "-1" : node.id);
                            if (selCatId) {
                                url += "&selCatId=" + selCatId;
                            }
                            return url;
                        },
                        "type": "get",
                        "success": function (ops) {
                            return ops;
                        }
                    }
                },
            "plugins": ["themes", "json_data", "ui", "cookies", "crrm", "sort"]
        }).on('changed.jstree', function (e, data) {
            var node = data.instance.get_node(data.selected[0]);
            if (node.original != null) {
                if (!node.original.isLeaf) {
                    if (node.original.id != $('#categoryId').val()) {
                        $('.loading-animation').css('display', 'block');
                        that.changeNodeSelection(node.original.id, node.original.text, "suggestedCategories");
                    }
                }
                else {
                    var nodeSelector = "#" + node.original.id;
                    if ($(nodeSelector).hasClass('jstree-open')) {
                        $("#treeCell").jstree("close_node", $("#" + node.original.id));
                    }
                    else {
                        $("#treeCell").jstree("open_node", $("#" + node.original.id));
                    }
                }
            }
        });
    }

    this.categorySelected = false;
    this.categoryInitialValue = '';

    this.initCategoryTypeahead = function () {
        //var $categoriesTextBox = $('.make-typeahead-categories');
        //that.categoryInitialValue = $categoriesTextBox.val();
        //$categoriesTextBox.typeahead({
        //    items: 'all',
        //    minLength: 0,
        //    source: that.getLeafCategories,
        //    displayText: function (item) {
        //        return item.text;
        //    },
        //    afterSelect: function (selected) {
        //        that.categorySelected = true;
        //        $('.loading-animation').css('display', 'block');
        //        that.categoryPostBack(selected.id, selected.categoryName);
        //    }
        //});
        //$categoriesTextBox.focusout(function () {
        //    if (!that.categorySelected) {
        //        $categoriesTextBox.val(that.categoryInitialValue);
        //    }
        //});
    }

    this.getLeafCategories = function (query, process) {
        $.ajax({
            type: "GET",
            dataType: 'json',
            url: "/QuestionCategory/GetLeafCategories?input=" + query,
            success: function (data) {
                return process(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });
    }

    this.init = function () {
        $(document).ready(function () {
            that.initializeTree();
            that.initCategoryTypeahead();
        });
    };
};